import type { UnifiedSignEntry } from "@/lib/sign-language";

export function SignVisual({ sign, compact = false }: { sign: UnifiedSignEntry; compact?: boolean }) {
  const visualPath = sign.animationPath || sign.imagePath;
  const isVideo = Boolean(visualPath && /\.(mp4|webm|ogg)(\?.*)?$/i.test(visualPath));
  return (
    <div className="sign-visual-content">
      <span className="sign-hand-pill">{sign.handCount === 1 ? "☝️ 1 Hand" : "👐 2 Hands"}</span>
      {visualPath ? (
        isVideo ? (
          <video className="sign-authentic-visual" src={visualPath} controls muted playsInline loop preload="metadata" aria-label={`${sign.language} visual reference for ${sign.label}`} />
        ) : (
          // The dataset only points here after an administrator has reviewed the source and rights.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="sign-authentic-visual" src={visualPath} alt={`${sign.language} visual reference for ${sign.label}`} loading="lazy" />
        )
      ) : (
        <>
          <span className="sign-card-visual-icon" aria-hidden="true">🖐</span>
          <span className="sign-placeholder-text">Authentic visual unavailable</span>
          <span className="sign-visual-disclaimer">Reference and expert validation pending</span>
        </>
      )}
      {!compact && <span className="sign-visual-language">{sign.language} · {sign.category}</span>}
    </div>
  );
}
