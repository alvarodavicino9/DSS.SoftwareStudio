import { useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { CASOS } from '../data/casos';
import { Link } from '../router';
import { trackEvent } from '../utils/analytics';
import CardFanCarousel from './CardFanCarousel';

export default function Portafolio() {
  const [headerRef, headerVisible] = useReveal();
  const [fanRef, fanVisible] = useReveal();
  const [selected, setSelected] = useState(0);

  const cards = CASOS.map((c) => ({ imgUrl: c.imagenes[0], alt: c.titulo }));
  const caso = CASOS[selected];

  function handleSelect(index) {
    setSelected(index);
    trackEvent('portfolio_card_select', { caso: CASOS[index].slug });
  }

  return (
    <section id="portafolio" className="section-textured" style={{ padding: '60px 40px 140px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', perspective: 1200 }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 32, maxWidth: 560 }}>
            <div className="section-kicker" />
            <h2 style={{ fontSize: 36, margin: '0 0 10px', letterSpacing: '-0.015em' }}>Demostración de Experiencia</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Elegí un proyecto para ver el detalle: problema, solución, resultado. Cada caso tiene además su propia página completa.
            </p>
          </div>
        </div>

        <div ref={fanRef} style={revealStyle(fanVisible, 1)}>
          <CardFanCarousel cards={cards} selectedIndex={selected} onSelect={handleSelect} />
        </div>

        <div key={caso.slug} className="fan-detail card elev-sm" style={{ marginTop: 8, padding: 'calc(var(--space-8) * 1.2)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 18 }}>
            {caso.cliente && <span className="tag tag-neutral">{caso.cliente}</span>}
            <h3 style={{ fontSize: 22, margin: 0, letterSpacing: '-0.01em' }}>{caso.titulo}</h3>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 700 }}>
            {caso.resumen}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 24 }}>
            <div>
              <span className="card-kicker" style={{ display: 'block', marginBottom: 6 }}>El problema</span>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)', margin: 0 }}>{caso.problema}</p>
            </div>
            <div>
              <span className="card-kicker" style={{ display: 'block', marginBottom: 6 }}>La solución</span>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)', margin: 0 }}>{caso.solucion}</p>
            </div>
            <div>
              <span className="card-kicker" style={{ display: 'block', marginBottom: 6 }}>El resultado</span>
              <p style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 500, color: 'var(--color-accent-300)', margin: 0 }}>{caso.resultado}</p>
            </div>
          </div>

          {caso.stack && caso.stack.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {caso.stack.map((tech) => (
                <span key={tech} className="tag tag-outline" style={{ fontSize: 12 }}>
                  {tech}
                </span>
              ))}
            </div>
          )}

          <Link to={`/portafolio/${caso.slug}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Ver caso completo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
