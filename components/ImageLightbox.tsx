"use client";

import { useEffect } from "react";

export type LightboxImage = {
  src: string;
  alt: string;
};

type ImageLightboxProps = {
  image: LightboxImage | null;
  onClose: () => void;
};

export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (!image) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div className="image-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="image-lightbox-close" type="button" onClick={onClose} aria-label="Zavřít">
        ×
      </button>

      <img
        className="image-lightbox-img"
        src={image.src}
        alt={image.alt}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
