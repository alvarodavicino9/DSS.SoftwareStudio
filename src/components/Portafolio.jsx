import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { CASOS } from '../data/casos';
import { Link } from '../router';
import { trackEvent } from '../utils/analytics';
import BrowserBar from './BrowserBar';

// v19: el abanico usa GSAP (~70 kB). Se carga aparte para que no viaje en el
// paquete inicial de la página; mientras llega, un bloque del mismo alto
// reserva el lugar (sin saltos de layout).
const CardFanCarousel = lazy(() => import('./CardFanCarousel'));

// Miniatura liviana para las tarjetas del abanico (640 px, WebP, ~5-20 kB):
// las tarjetas miden como mucho 300 px de ancho, así que la captura completa
// de 1280 px (40-100 kB en JPG) era peso de más. Las capturas completas
// siguen en `imagenes` para la página de cada caso.
const thumbOf = (src) => src.replace(/\/[^/]+$/, '/thumb.webp');
const webpOf = (src) => src.replace(/\.jpe?g$/i, '.webp');
export default function Portafolio() {
  const [headerRef, headerVisible] = useReveal();
  const [fanRef, fanVisible] = useReveal({ threshold: 0.1 });
  const [selected, setSelected] = useState(0);

  // Avance automático del abanico — v20: antes cambiaba de proyecto cada 5,5 s
  // aunque el usuario estuviera leyendo el panel de detalle, y se le iba lo
  // que estaba leyendo. Ahora:
  //  - se apaga para siempre apenas el usuario toca, hace click o usa el
  //    teclado en cualquier parte de la sección (eligió leer, no mirar);
  //  - se pausa mientras el mouse está sobre la sección;
  //  - se pausa mientras el panel de detalle está a la vista (leyendo).
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !autoplay) return undefined;
    const stop = () => setAutoplay(false);
    const events = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((ev) => el.addEventListener(ev, stop, { passive: true }));
    return () => events.forEach((ev) => el.removeEventListener(ev, stop));
  }, [autoplay]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el || !autoplay) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        // "Leyendo" = se ve buena parte del panel: el 60% de su alto, o la
        // mitad de la pantalla si el panel es más alto que eso (celular).
        const need = Math.min(entry.boundingClientRect.height * 0.6, window.innerHeight * 0.5);
        setReading(entry.intersectionRect.height >= need);
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoplay, selected]);

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
    <section
      id="portafolio"
      ref={sectionRef}
      className="section-textured section-pad"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
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
            <CardFanCarousel
              cards={cards}
              selectedIndex={selected}
              onSelect={handleSelect}
              autoplay={autoplay}
              paused={hovering || reading}
            />
          </Suspense>
        </div>

        <article
          key={caso.slug}
          ref={panelRef}
          className="fan-detail card caso-panel"
          aria-live="polite"
          aria-labelledby="caso-panel-title"
        >
          <div className="caso-panel-top">
            <Link to={`/portafolio/${caso.slug}`} className="caso-shot" aria-label={`Ver caso completo: ${caso.titulo}`}>
              <BrowserBar url={caso.url} />
              <picture>
                <source type="image/webp" srcSet={`${thumbOf(caso.imagenes[0])} 640w, ${webpOf(caso.imagenes[0])} 1280w`} sizes="(max-width: 900px) 92vw, 520px" />
                <img src={caso.imagenes[0]} alt="" width={1280} height={720} loading="lazy" decoding="async" />
              </picture>
            </Link>

            <div className="caso-panel-info">
              <div className="caso-panel-meta">
                <span className="caso-meta-index">
                  {String(selected + 1).padStart(2, '0')} <span aria-hidden="true">/</span> {String(CASOS.length).padStart(2, '0')}
                </span>
                <span className="caso-meta-client">{caso.cliente || 'Proyecto del estudio'}</span>
                {caso.url && (
                  <span className="caso-live">
                    <i aria-hidden="true" /> En producción
                  </span>
                )}
              </div>

              <h3 id="caso-panel-title">{caso.titulo}</h3>
              <p className="caso-panel-resumen">{caso.resumen}</p>

              <div className="caso-result">
                <span className="caso-result-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 17l5-5 4 4 7-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 8h5v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <span className="caso-result-label">El resultado</span>
                  <p>{caso.resultado}</p>
                </div>
              </div>

              {caso.stack?.length > 0 && (
                <ul className="tech-list" aria-label="Tecnologías">
                  {caso.stack.map((tech) => (
                    <li key={tech} className="tech-chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              )}

              <div className="caso-panel-actions">
                <Link to={`/portafolio/${caso.slug}`} className="btn btn-primary">
                  Ver caso completo
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                    Visitar sitio
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="caso-panel-ps">
            <div>
              <span className="caso-ps-label">
                <b>01</b> El problema
              </span>
              <p>{caso.problema}</p>
            </div>
            <div>
              <span className="caso-ps-label">
                <b>02</b> La solución
              </span>
              <p>{caso.solucion}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
