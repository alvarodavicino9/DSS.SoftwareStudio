import { useReveal, revealStyle } from '../hooks/useReveal';
import { CASOS } from '../data/casos';
import PortfolioCard from './PortfolioCard';

export default function Portafolio() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal();

  return (
    <section id="portafolio" className="section-textured" style={{ padding: '60px 40px 140px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', perspective: 1200 }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 48, maxWidth: 560 }}>
            <div className="section-kicker" />
            <h2 style={{ fontSize: 36, margin: '0 0 10px', letterSpacing: '-0.015em' }}>Demostración de Experiencia</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Así encaramos un proyecto: problema, solución, resultado. Cada caso tiene su propia página con el detalle completo.
            </p>
          </div>
        </div>

        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {CASOS.map((c, i) => (
            <PortfolioCard key={c.slug} caso={c} index={i} visible={gridVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
