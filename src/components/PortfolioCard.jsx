import { useRef } from 'react';
import { Link } from '../router';
import { revealStyle } from '../hooks/useReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import Carousel from './Carousel';

// Card de un proyecto en la grilla de Portafolio.jsx. Dos animaciones
// conviven acá, cada una en su propio elemento para no pisarse:
//
// 1. Reveal de entrada (`revealStyle`, en el div exterior) — controlado por
//    React state (`visible`), corre una sola vez cuando la sección entra en
//    viewport.
// 2. Inclinación 3D que sigue el mouse (`.portfolio-tilt`, en el div del
//    medio) — mutada directo sobre el DOM con `style.setProperty` en el
//    mousemove, sin pasar por React state, para que seguir al cursor sea
//    fluido (60fps) y no dispare un re-render de todo el card en cada pixel
//    de movimiento del mouse.
//
// El brillo ambiente (`.portfolio-spotlight`) usa las mismas coordenadas del
// mouse vía custom properties CSS (`--spot-x/--spot-y`), heredadas del
// wrapper de tilt hacia el resto de la card.
export default function PortfolioCard({ caso, index, visible }) {
  const tiltRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleMove = (e) => {
    if (reducedMotion) return;
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--tilt-x', `${(0.5 - py) * 7}deg`);
    el.style.setProperty('--tilt-y', `${(px - 0.5) * 7}deg`);
    el.style.setProperty('--spot-x', `${px * 100}%`);
    el.style.setProperty('--spot-y', `${py * 100}%`);
    el.style.setProperty('--spot-opacity', '1');
  };

  const handleLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    el.style.setProperty('--spot-opacity', '0');
  };

  return (
    <div style={revealStyle(visible, index + 1, 'cinematografica', { height: '100%' })}>
      <div ref={tiltRef} className="portfolio-tilt" onMouseMove={handleMove} onMouseLeave={handleLeave}>
        <Link
          to={`/portafolio/${caso.slug}`}
          className="card elev-sm portfolio-card"
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            padding: 'var(--space-8)',
          }}
        >
          <div className="portfolio-spotlight" />

          {caso.imagenes && caso.imagenes.length > 0 && (
            <div className="portfolio-cover">
              <Carousel images={caso.imagenes} alt={caso.titulo} interval={3600 + index * 650} compact />
            </div>
          )}

          <div className="portfolio-accent" style={{ height: 4, width: 40, borderRadius: 2 }} />
          {caso.cliente && (
            <span className="tag tag-neutral" style={{ alignSelf: 'flex-start' }}>{caso.cliente}</span>
          )}
          <div>
            <h3 className="card-title" style={{ marginBottom: 'var(--space-2)' }}>{caso.titulo}</h3>
            <p
              className="card-body"
              style={{
                opacity: 0.9,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {caso.resumen}
            </p>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <span className="card-kicker" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Resultado</span>
            <p className="card-body" style={{ fontWeight: 500, opacity: 1, color: 'var(--color-accent-300)' }}>{caso.resultado}</p>
          </div>

          {caso.stack && caso.stack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {caso.stack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="tag tag-neutral"
                  style={{ fontFamily: 'monospace', fontSize: 11, padding: '4px 9px' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <span className="portfolio-cta">
            Ver caso completo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
