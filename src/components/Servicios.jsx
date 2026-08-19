import { useReveal, revealStyle } from '../hooks/useReveal';
import { ServerIcon, GlobeIcon, BotIcon } from './SectionIcons';

const SERVICES = [
  {
    title: 'Landings & Sitios Web',
    desc: 'Sitios web rápidos, responsivos y optimizados para buscadores, con diseño a medida y sin plantillas genéricas.',
    Icon: ServerIcon,
  },
  {
    title: 'Plataformas Web & PWAs',
    desc: 'Apps web rápidas, instalables en el celular como una app nativa, pensadas para que tus usuarios no se frustren.',
    Icon: GlobeIcon,
  },
  {
    title: 'Bots & Automatizaciones',
    desc: 'Automatizamos tareas repetitivas y tediosas, para que tu equipo pueda enfocarse en lo que realmente importa.',
    Icon: BotIcon,
  },
];

export default function Servicios() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal();

  return (
    <section id="servicios" className="section-textured" style={{ padding: '60px 40px 140px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 48, maxWidth: 560 }}>
            <div className="section-kicker" />
            <h2 style={{ fontSize: 36, margin: '0 0 10px', letterSpacing: '-0.015em' }}>Lo Que Hacemos</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, margin: 0 }}>
              Soluciones a medida, del primer prototipo al sistema en producción.
            </p>
          </div>
        </div>

        <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {SERVICES.map((s, i) => (
            <div key={s.title} style={revealStyle(gridVisible, i + 1, 'cinematografica', { height: '100%' })}>
              <div className="card elev-sm" style={{ height: '100%', padding: 'var(--space-8)' }}>
                <span className="icon-badge" style={{ marginBottom: 'var(--space-4)' }}>
                  <s.Icon />
                </span>
                <h3 className="card-title">{s.title}</h3>
                <p className="card-body">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
