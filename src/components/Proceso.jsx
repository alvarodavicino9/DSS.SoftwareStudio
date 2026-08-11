import { useReveal, revealStyle } from '../hooks/useReveal';

const STEPS = [
  {
    n: '01',
    title: 'Diagnóstico',
    desc: 'Una llamada breve para entender tu problema real, tu operación actual y qué resultado necesitás — sin tecnicismos.',
  },
  {
    n: '02',
    title: 'Propuesta',
    desc: 'Alcance, tiempos y costo por escrito antes de arrancar. Sin letra chica ni sorpresas a mitad de camino.',
  },
  {
    n: '03',
    title: 'Desarrollo',
    desc: 'Entregas funcionales cada semana. Ves avances reales, no promesas — y podés reajustar el rumbo mientras construimos.',
  },
  {
    n: '04',
    title: 'Entrega & Soporte',
    desc: 'Deploy a producción y acompañamiento posterior al lanzamiento. El proyecto no termina cuando sale a producción.',
  },
];

export default function Proceso() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal();

  return (
    <section id="proceso" className="section-textured section-alt" style={{ padding: '60px 40px 140px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 48, maxWidth: 560 }}>
            <div className="section-kicker" />
            <h2 style={{ fontSize: 36, margin: '0 0 10px', letterSpacing: '-0.015em' }}>Cómo Trabajamos</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Cuatro pasos simples, siempre hablando con quien escribe el código.
            </p>
          </div>
        </div>

        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {STEPS.map((step, i) => (
            <div key={step.n} style={revealStyle(gridVisible, i + 1, 'cinematografica', { height: '100%' })}>
              <div className="card elev-sm" style={{ height: '100%', padding: 'var(--space-8)' }}>
                <span className="step-badge" style={{ marginBottom: 'var(--space-4)' }}>{step.n}</span>
                <h3 className="card-title">{step.title}</h3>
                <p className="card-body">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
