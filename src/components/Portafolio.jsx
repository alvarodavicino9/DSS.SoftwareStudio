import { useReveal, revealStyle } from '../hooks/useReveal';
import { Link } from '../router';
import { CASOS } from '../data/casos';

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
            <div key={c.slug} style={revealStyle(gridVisible, i + 1, 'cinematografica', { height: '100%' })}>
              <Link
                to={`/portafolio/${c.slug}`}
                className="card elev-sm"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-8)',
                }}
              >
                {c.imagenes && c.imagenes.length > 0 && (
                  <div className="portfolio-cover">
                    <img src={c.imagenes[0]} alt={c.titulo} loading="lazy" />
                  </div>
                )}
                <div className="portfolio-accent" style={{ height: 4, width: 40, borderRadius: 2, background: 'var(--gradient-brand)' }} />
                {c.cliente && (
                  <span className="tag tag-neutral" style={{ alignSelf: 'flex-start' }}>{c.cliente}</span>
                )}
                <div>
                  <h3 className="card-title" style={{ marginBottom: 'var(--space-2)' }}>{c.titulo}</h3>
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
                    {c.resumen}
                  </p>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <span className="card-kicker" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Resultado</span>
                  <p className="card-body" style={{ fontWeight: 500, opacity: 1, color: 'var(--color-accent-300)' }}>{c.resultado}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent-300)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  Ver caso completo →
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
