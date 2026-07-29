import { useState } from "react";
import "./ImageWithSkeleton.css";

export default function ImageWithSkeleton({ src, alt, className = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="skeleton-wrapper">
      {/* 1. Mostra lo skeleton se sta caricando e NON c'è stato errore */}
      {!isLoaded && !hasError && <div className="skeleton-loader" />}

      {/* 2. Se l'immagine fallisce (404 / percorso errato), mostra un'icona di fallback */}
      {hasError && (
        <div className="image-fallback">
          🏆 {/* O un'emoji/icona di default per il badge */}
        </div>
      )}

      {/* 3. L'immagine vera */}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "loaded" : "loading"}`}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          console.error("Errore caricamento immagine badge:", src);
          setHasError(true);
        }}
        style={{ display: hasError ? "none" : "block" }}
      />
    </div>
  );
}