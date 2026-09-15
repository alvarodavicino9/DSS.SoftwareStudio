import { useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { APPS } from '../data/apps';
import { trackEvent } from '../utils/analytics';
import SpotlightButton from './SpotlightButton';

// Slots punteados "Próxima app" para anticipar que vienen más apps. Ocultos
// por ahora (0): con una sola app se leían como espacio vacío. Para volver a
// mostrarlos, subir este número (ej. 2); el markup y los estilos .app-slot
// siguen intactos.
const PROXIMAS = 0;

// Captura de 540x1036 (ver apps.js). width/height explícitos en el
// <img> para que el navegador reserve el alto antes de que cargue, sin saltos
// de layout. Si la captura todavía no existe, se oculta y queda el marco vacío
// en vez del ícono de imagen rota.
function PhoneFrame({ src, alt }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="app-phone">
      <div className="app-phone-screen">
        {!failed && <img src={src} alt={alt} width={540} height={1036} loading="lazy" onError={() => setFailed(true)} />}
      </div>
    </div>
  );
}

export default function AppsEstudio() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal();
  const [app] = APPS;

  return (
    <section id="apps" className="section-textured" style={{ padding: '60px 40px 140px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 48, maxWidth: 560 }}>
            <div className="section-kicker" />
            <h2 style={{ fontSize: 36, margin: '0 0 10px', letterSpacing: '-0.015em' }}>Apps del Estudio</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Productos propios que hacemos y mantenemos nosotros, gratis para el que quiera usarlos.
            </p>
          </div>
        </div>

        <div ref={gridRef}>
          <div style={revealStyle(gridVisible, 1)}>
            <article className="card elev-sm app-feature" aria-labelledby={`app-${app.slug}`}>
              <PhoneFrame src={app.imagen} alt={app.alt} />

              <div>
                <h3 id={`app-${app.slug}`} style={{ fontSize: 26, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                  {app.nombre}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 520 }}>
                  {app.resumen}
                </p>
                <ul className="app-chips" aria-label="Características">
                  {app.chips.map((chip) => (
                    <li key={chip} className="tag tag-neutral">
                      {chip}
                    </li>
                  ))}
                </ul>
                <SpotlightButton
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  onClick={() => trackEvent('cta_click', { label: 'abrir_anotador', location: 'apps' })}
                >
                  Abrir el anotador <span aria-hidden="true">↗</span>
                </SpotlightButton>
              </div>
            </article>
          </div>

          {PROXIMAS > 0 && (
            <div className="app-slots">
              {Array.from({ length: PROXIMAS }, (_, i) => (
                <div key={i} className="app-slot" style={revealStyle(gridVisible, i + 2)}>
                  Próxima app
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
