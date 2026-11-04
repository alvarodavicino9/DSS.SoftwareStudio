import { lazy, Suspense, useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { CASOS } from '../data/casos';
import { Link } from '../router';
import { trackEvent } from '../utils/analytics';

// v19: el abanico usa GSAP (~70 kB). Se carga aparte para que no viaje en el
// paquete inicial de la página; mientras llega, un bloque del mismo alto
// reserva el lugar (sin saltos de layout).
const CardFanCarousel = lazy(() => import('./CardFanCarousel'));

// Miniatura liviana para las tarjetas del abanico (640 px, WebP, ~5-20 kB):
// las tarjetas miden como mucho 300 px de ancho, así que la captura completa
// de 1280 px (40-100 kB en JPG) era peso de más. Las capturas completas
// siguen en `imagenes` para la página de cada caso.
const thumbOf = (src) => src.replace(/\/[^/]+$/, '/thumb.webp');

export default function Portafolio() {
  const [headerRef, headerVisible] = useReveal();
  const [fanRef, fanVisible] = useReveal({ threshold: 0.1 });
  const [selected, setSelected] = useState(0);

  const cards = CASOS.map((c) => {
    const thumb = thumbOf(c.imagenes[0]);
    return { imgUrl: thumb, srcSet: `${thumb.replace('thumb.webp', 'thumb-320.webp')} 320w, ${thumb} 640w`, alt: c.titulo };
  });
  const caso = CASOS[selected];

  function handleSelect(index) {
    setSelected(index);
    trackEvent('portfolio_card_select', { caso: CASOS[index].slug });
  }

  return (
    <section id="portafolio" className="section-textured section-pad">
      <div style={{ maxWidth: 1200, margin: '0 auto', perspective: 1200 }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 12, maxWidth: 620 }}>
            <div className="section-kicker" />
            <h2 className="section-title">Proyectos reales</h2>
            <p className="section-sub">
              Elegí un proyecto para ver el problema, la solución y el resultado. Cada uno tiene además su página con el
              detalle completo.
            </p>
          </div>
        </div>

        <div ref={fanRef} style={revealStyle(fanVisible, 1)}>
          <Suspense fallback={<div className="fan-placeholder" aria-hidden="true" />}>
            <CardFanCarousel cards={cards} selectedIndex={selected} onSelect={handleSelect} />
          </Suspense>
        </div>

        <div key={caso.slug} className="fan-detail card elev-sm caso-panel" aria-live="polite">
          <div className="caso-panel-head">
            {caso.cliente && <span className="tag tag-neutral">{caso.cliente}</span>}
            <h3>{caso.titulo}</h3>
          </div>

          <p className="caso-panel-resumen">{caso.resumen}</p>

          <div className="caso-panel-grid">
            <div className="caso-panel-ps">
              <span className="card-kicker">El problema</span>
              <p>{caso.problema}</p>
            </div>
            <div className="caso-panel-ps">
              <span className="card-kicker">La solución</span>
              <p>{caso.solucion}</p>
            </div>
            <div>
              <span className="card-kicker">El resultado</span>
              <p className="caso-panel-resultado">{caso.resultado}</p>
            </div>
          </div>

          {caso.stack?.length > 0 && (
            <div className="caso-panel-stack">
              {caso.stack.map((tech) => (
                <span key={tech} className="tag tag-outline">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="caso-panel-actions">
            <Link to={`/portafolio/${caso.slug}`} className="btn btn-primary">
              Ver caso completo
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            {caso.url && (
              <a
                href={caso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                onClick={() => trackEvent('portfolio_live_site_click', { caso: caso.slug, location: 'home' })}
              >
                Ver sitio en vivo <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
