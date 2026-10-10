# SANKET Recognition Service

Optional Python inference service for the SANKET Next.js frontend.

## Default model references

- ISL: `Hemg/Indian-sign-language-classification` (Apache-2.0; 343 MB model file). Its public model card reports 99.05% evaluation accuracy, but the dataset description is incomplete, so **do not treat that figure as SANKET performance**.
- ASL: `Abuzaid01/asl-sign-language-classifier` (MIT; about 98.6 MB). It is based on the ASL alphabet dataset and therefore should not be treated as a 36-class civic-language model.

The frontend remains human-in-the-loop: predictions are suggestions only and are never automatically inserted into the message draft.

## Run

```bash
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

Configure the Next.js app with:

```text
SANKET_RECOGNITION_ENDPOINT=http://127.0.0.1:8000/predict
```

For deployment, put the inference service behind HTTPS and an authenticated/private network boundary. Do not expose raw citizen images or model credentials unnecessarily.
