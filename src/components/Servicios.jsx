import { useReveal, revealStyle } from '../hooks/useReveal';

const SERVICES = [
  {
    title: 'Sistemas & Backend',
    desc: 'Automatización de procesos operativos, gestión de bases de datos y APIs seguras y escalables que integran tus sistemas existentes.',
  },
  {
    title: 'Plataformas Web & PWAs',
    desc: 'Aplicaciones web modernas, ultra rápidas e instalables en móviles, pensadas para la mejor experiencia de tus usuarios.',
  },
  {
    title: 'Desarrollo de MVPs',
    desc: 'Construcción rápida de Productos Mínimos Viables para validar tu idea de negocio en tiempo récord, con métricas desde el día uno.',
  },
];

const STACK = ['Python / Django', 'JavaScript / React', 'C# / .NET', 'SQL Server / SQLite', 'REST APIs', 'Git / CI-CD'];

export default function Servicios() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal();

  return (
    <section id="servicios" className="section-textured" style={{ padding: '60px 40px 140px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div style={{ marginBottom: 48, maxWidth: 560 }}>
            <h2 style={{ fontSize: 36, margin: '0 0 10px', letterSpacing: '-0.015em' }}>Lo Que Podemos Hacer</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Soluciones integrales para cualquier tipo de complejidad.
            </p>
          </div>
        </div>

        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {SERVICES.map((s, i) => (
            <div key={s.title} style={revealStyle(gridVisible, i + 1, 'cinematografica', { height: '100%' })}>
              <div className="card elev-sm" style={{ height: '100%', padding: 'var(--space-8)' }}>
                <h3 className="card-title">{s.title}</h3>
                <p className="card-body">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 72 }}>
          <h6 style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)', margin: '0 0 20px', fontWeight: 400 }}>
            Stack Tecnológico Principal
          </h6>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {STACK.map((tech, i) => (
              <div key={tech} style={revealStyle(gridVisible, i + 4)}>
                <span className="tag tag-neutral">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
