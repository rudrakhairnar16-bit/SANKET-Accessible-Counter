import base64
import io
import os
from functools import lru_cache

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from PIL import Image
from transformers import pipeline

app = FastAPI(title="SANKET Recognition Service", version="1.0.0")

MODELS = {
    "ISL": os.getenv("SANKET_ISL_MODEL", "Hemg/Indian-sign-language-classification"),
    "ASL": os.getenv("SANKET_ASL_MODEL", "Abuzaid01/asl-sign-language-classifier"),
}
MAX_B64_CHARS = 2_000_000

class RequestBody(BaseModel):
    image: str = Field(min_length=32, max_length=MAX_B64_CHARS)
    language: str
    top_k: int = Field(default=3, ge=1, le=5)

@lru_cache(maxsize=2)
def get_classifier(language: str):
    if language not in MODELS:
        raise ValueError("Unsupported language")
    return pipeline("image-classification", model=MODELS[language])

def decode_jpeg(data_url: str) -> Image.Image:
    prefix = "data:image/jpeg;base64,"
    if not data_url.startswith(prefix):
        raise HTTPException(status_code=400, detail="A JPEG data URL is required.")
    raw = data_url[len(prefix):]
    try:
        payload = base64.b64decode(raw, validate=True)
        if len(payload) > 1_500_000:
            raise HTTPException(status_code=413, detail="Image is too large.")
        image = Image.open(io.BytesIO(payload))
        if image.format != "JPEG":
            raise HTTPException(status_code=400, detail="Image must be JPEG.")
        return image.convert("RGB")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid JPEG image.") from exc

@app.get("/health")
def health():
    return {"ok": True, "models": MODELS}

@app.post("/predict")
def predict(body: RequestBody):
    language = body.language.upper()
    image = decode_jpeg(body.image)
    try:
        classifier = get_classifier(language)
        results = classifier(image, top_k=body.top_k)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Model inference failed: {type(exc).__name__}") from exc
    if not results:
        raise HTTPException(status_code=502, detail="Model returned no predictions.")
    top = results[0]
    return {
        "label": str(top["label"])[:120],
        "confidence": float(top["score"]),
        "language": language,
        "suggestions": [{"label": str(r["label"])[:120], "confidence": float(r["score"])} for r in results],
        "model": MODELS[language],
        "note": "Model output is an unconfirmed suggestion. It is not certified sign-language translation and is not automatically inserted into the citizen draft.",
    }
