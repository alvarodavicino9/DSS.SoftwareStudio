import { useReveal, revealStyle } from '../hooks/useReveal';

// `cliente` queda null hasta que haya casos reales publicables (ver README).
// Apenas se complete, la card muestra automáticamente el nombre arriba del
// problema — no hace falta tocar el JSX, solo llenar el dato acá.
const CASES = [
  {
    cliente: null,
    problema: 'Lentitud en la toma de pedidos y gestión manual de stock en planillas propensas a errores.',
    solucion: 'Sistema Web Progresivo (PWA) sincronizado en tiempo real con base de datos central y alertas de stock bajo.',
    resultado: 'Reducción del 55% en el tiempo de carga de datos y cero pedidos perdidos por desincronización.',
  },
  {
    cliente: null,
    problema: 'Falta de una plataforma digital propia para comercializar y gestionar servicios a clientes.',
    solucion: 'Plataforma web a medida con panel de administración, agenda de turnos y reportes automáticos.',
    resultado: 'Automatización total de la agenda de clientes y reducción del trabajo administrativo manual.',
  },
  {
    cliente: null,
    problema: 'Necesidad de validar un producto de software nuevo sin invertir meses de desarrollo por adelantado.',
    solucion: 'MVP funcional lanzado en 3 semanas, con analítica integrada desde el primer usuario.',
    resultado: 'Validación exitosa del modelo de negocio y primeros usuarios reales en menos de un mes.',
  },
];

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
              Así encaramos un proyecto: problema, solución, resultado.
            </p>
          </div>
        </div>

        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {CASES.map((c, i) => (
            <div key={c.problema} style={revealStyle(gridVisible, i + 1, 'cinematografica', { height: '100%' })}>
              <div className="card elev-sm" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-8)' }}>
                <div className="portfolio-accent" style={{ height: 4, width: 40, borderRadius: 2, background: 'var(--gradient-brand)' }} />
                {c.cliente && (
                  <span className="tag tag-neutral" style={{ alignSelf: 'flex-start' }}>{c.cliente}</span>
                )}
                <div>
                  <span className="card-kicker" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Problema</span>
                  <p className="card-body" style={{ opacity: 0.9 }}>{c.problema}</p>
                </div>
                <div>
                  <span className="card-kicker" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Solución</span>
                  <p className="card-body" style={{ opacity: 0.9 }}>{c.solucion}</p>
                </div>
                <div>
                  <span className="card-kicker" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Resultado</span>
                  <p className="card-body" style={{ fontWeight: 500, opacity: 1, color: 'var(--color-accent-300)' }}>{c.resultado}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
