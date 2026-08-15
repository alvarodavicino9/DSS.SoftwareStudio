import { useEffect, useRef, useState } from 'react';

// Carrusel de imágenes que avanza solo cada `interval` ms, con flechas y
// puntos para navegación manual. Pausa el auto-avance mientras el usuario
// tiene el mouse encima o está interactuando (arrastre táctil básico), y
// respeta prefers-reduced-motion desactivando el auto-avance del todo.
// Uso: <Carousel images={['/a.jpg', '/b.jpg']} alt="Nombre del proyecto" />
export default function Carousel({ images, alt = '', interval = 4200, rounded = true, aspectRatio = '16 / 9' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!images || images.length <= 1 || paused || reducedMotion) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images, paused, reducedMotion, interval]);

  if (!images || images.length === 0) return null;

  const goTo = (i) => setIndex(((i % images.length) + images.length) % images.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="carousel-root"
      style={{ borderRadius: rounded ? 'var(--radius-lg)' : 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="carousel-viewport" style={{ aspectRatio }}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${alt} — captura ${i + 1} de ${images.length}`}
            className="carousel-slide"
            style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-prev"
            onClick={prev}
            aria-label="Imagen anterior"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-next"
            onClick={next}
            aria-label="Imagen siguiente"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="carousel-dots">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`carousel-dot${i === index ? ' carousel-dot-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
