import { useReveal, revealStyle } from '../hooks/useReveal';

const FOUNDERS = [
  { name: 'Álvaro Davicino', role: 'Ingeniero en Software' },
  { name: 'Gabriel Schurrer', role: 'Ingeniero en Software' },
];

const VALUES = [
  { label: 'Agilidad', desc: 'Entregables funcionales continuos, con feedback cada semana en vez de sorpresas al final.' },
  { label: 'Flexibilidad', desc: 'Nos adaptamos a tu rubro, tu stack existente y tu forma de trabajar — no al revés.' },
  { label: 'Compromiso', desc: 'Garantía de soporte posterior al lanzamiento. El proyecto no termina en el deploy.' },
];

export default function Nosotros() {
  const [ref, visible] = useReveal();

  return (
    <section id="nosotros" className="section-textured section-alt" style={{ padding: '150px 40px' }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', ...revealStyle(visible, 0) }}>
        <div
          id="nosotros-grid"
          className="card elev-sm"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: 'var(--space-8)',
            alignItems: 'start',
            padding: 'calc(var(--space-8) * 2.5)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div>
            <span className="tag tag-outline" style={{ marginBottom: 'var(--space-6)', display: 'inline-flex' }}>
              Ingeniería &amp; Compromiso
            </span>
            <h2 style={{ fontSize: 32, margin: '16px 0 16px', letterSpacing: '-0.015em' }}>
              Trato directo con los desarrolladores
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, margin: '0 0 28px' }}>
              Eliminamos las capas comerciales e intermediarios. En DS.SoftwareStudio diseñamos y programamos
              directamente nosotros, asegurando flexibilidad, código limpio y cumplimiento estricto de tiempos.
              Cada decisión técnica la toma quien después la sostiene en producción.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {FOUNDERS.map((f, i) => (
                <div
                  key={f.name}
                  style={revealStyle(visible, i + 1, 'cinematografica', {
                    background: 'var(--color-neutral-800)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    flex: '1 1 200px',
                  })}
                >
                  <strong style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>{f.name}</strong>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 18, margin: '0 0 18px' }}>Nuestros Valores</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {VALUES.map((v, i) => (
                <div key={v.label} style={revealStyle(visible, i + 1)}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--color-accent)',
                        flex: 'none',
                        marginTop: 6,
                      }}
                    />
                    <p style={{ margin: 0, fontSize: 14, color: 'rgba(20,21,31,0.8)' }}>
                      <strong style={{ color: 'var(--color-text)', fontWeight: 500 }}>{v.label}:</strong> {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
