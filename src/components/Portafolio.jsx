import { useEffect, useMemo, useRef, useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { CASOS } from '../data/casos';
import { Link } from '../router';
import { trackEvent } from '../utils/analytics';
import BrowserBar from './BrowserBar';
import TiltedGridHero from './ui/TiltedGridHero';

// Miniatura liviana (640 px, WebP) y captura completa en WebP (1280 px).
const thumbOf = (src) => src.replace(/\/[^/]+$/, '/thumb.webp');
const webpOf = (src) => src.replace(/\.jpe?g$/i, '.webp');

// v22: el abanico (CardFanCarousel + GSAP) se reemplazó por una cinta curva
// (TiltedGridHero) que pasa sola con las capturas de los proyectos. Tocar o
// hacer click en una tarjeta elige ese proyecto, y debajo hay una fila con
// el nombre de cada uno para elegirlo directo (y con teclado). La cinta se
// mueve sola pero el proyecto elegido NO cambia solo: el panel de detalle
// queda fijo hasta que el usuario elige otro.
export default function Portafolio() {
  const [headerRef, headerVisible] = useReveal();
  const [bandRef, bandVisible] = useReveal({ threshold: 0.1 });
  const [selected, setSelected] = useState(0);

  // En pantallas anchas las tarjetas miden ~370 px (≈740 px reales en
  // pantallas 2x): la captura de 1280 px. En el celular, la de 640 px alcanza.
  const images = useMemo(() => {
    const big = typeof window !== 'undefined' && window.innerWidth * (window.devicePixelRatio || 1) > 1100;
    return CASOS.map((c) => ({ src: big ? webpOf(c.imagenes[0]) : thumbOf(c.imagenes[0]), alt: c.titulo }));
  }, []);
  // En el celular la cinta es más chata y con tarjetas más chicas: con la
  // curva de escritorio las puntas se agrandaban tanto que se veían solo dos.
  const [small] = useState(() => typeof window !== 'undefined' && window.innerWidth < 700);
  const caso = CASOS[selected];

  // En el celular la fila de nombres se desliza de costado: se centra sola
  // en el proyecto elegido (sin mover la página).
  const tabsRef = useRef(null);
  useEffect(() => {
    const row = tabsRef.current;
    const btn = row?.querySelector('.portfolio-tab.is-active');
    if (!row || !btn || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2, behavior: 'smooth' });
  }, [selected]);

  function handleSelect(index, via) {
    setSelected(index);
    trackEvent('portfolio_card_select', { caso: CASOS[index].slug, via });
  }

  return (
    <section id="portafolio" className="section-textured section-pad">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 8, maxWidth: 620 }}>
            <div className="section-kicker" />
            <h2 className="section-title">Proyectos reales</h2>
            <p className="section-sub">
              Tocá un proyecto para ver el problema, la solución y el resultado. Cada uno tiene además su página con el
              detalle completo.
            </p>
          </div>
        </div>
      </div>

      <div ref={bandRef} style={revealStyle(bandVisible, 1)}>
        <TiltedGridHero
          className="portfolio-band"
          images={images}
          speed={small ? 3.5 : 4.5}
          tileHeight={small ? 40 : 42}
          aspectRatio={16 / 9}
          gap={7}
          axis={50}
          curve={small ? 55 : 80}
          fade={6}
          activeIndex={selected}
          onTileClick={(i) => handleSelect(i, 'cinta')}
          tileLabel={(i) => CASOS[i].nombre}
        />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={tabsRef} className="portfolio-tabs" role="tablist" aria-label="Proyectos">
          {CASOS.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-controls="caso-panel"
              className={`portfolio-tab${i === selected ? ' is-active' : ''}`}
              onClick={() => handleSelect(i, 'lista')}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        <div
          key={caso.slug}
          id="caso-panel"
          role="tabpanel"
          className="fan-detail card caso-panel"
          aria-labelledby="caso-panel-title"
        >
          <div className="caso-panel-top">
            {/* Misma acción que el botón "Ver caso completo": fuera del orden
                de tabulación y oculta a lectores de pantalla para no repetirla. */}
            <Link to={`/portafolio/${caso.slug}`} className="caso-shot" tabIndex={-1} aria-hidden="true">
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
        </div>
      </div>
    </section>
  );
}
