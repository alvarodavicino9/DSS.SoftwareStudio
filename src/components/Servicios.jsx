import { useReveal, revealStyle } from '../hooks/useReveal';
import { Link } from '../router';
import { ServerIcon, BagIcon, PanelIcon, CalendarIcon, PhoneIcon, BotIcon } from './SectionIcons';

// v19: de 3 a 6 servicios, alineados con lo que el estudio ya hizo de verdad
// (casos.js). Los que tienen un caso real lo linkean como ejemplo — es la
// mejor prueba de que lo sabemos hacer. Si se agrega/cambia un caso, revisar
// los slugs de `ejemplo`.
const SERVICES = [
  {
    title: 'Sitios web y landings',
    desc: 'Rápidos, adaptados al celular y pensados para aparecer en Google. Diseño propio, nada de plantillas genéricas.',
    Icon: ServerIcon,
    ejemplo: { slug: 'hipermat-corralon-materiales-construccion', label: 'Hipermat' },
  },
  {
    title: 'Tiendas online y catálogos',
    desc: 'Catálogo con filtros y buscador, carrito y pedidos que llegan listos a tu WhatsApp, sin comisiones por venta.',
    Icon: BagIcon,
    ejemplo: { slug: 'good-luck-store-tienda-de-iphone', label: 'Good Luck Store' },
  },
  {
    title: 'Sistemas con panel de administración',
    desc: 'Cargá productos, precios, stock y contenido vos mismo, sin depender de un programador para cada cambio.',
    Icon: PanelIcon,
    ejemplo: { slug: 'ds-burguer-menu-online-con-pedidos', label: 'pedidos para hamburgueserías' },
  },
  {
    title: 'Reservas y turnos online',
    desc: 'Tus clientes reservan solos, a cualquier hora, respetando tus horarios reales. Vos ves todo en un calendario.',
    Icon: CalendarIcon,
    ejemplo: { slug: 'veterinaria-y-pet-shop-turnos-online', label: 'veterinaria con turnos' },
  },
  {
    title: 'Apps web instalables (PWA)',
    desc: 'Se instalan en el celular como una app, funcionan sin conexión y no hace falta publicarlas en ninguna tienda.',
    Icon: PhoneIcon,
    ejemplo: { slug: 'torneo-star-basket-estadisticas-en-vivo', label: 'Torneo Star Basket' },
  },
  {
    title: 'Automatizaciones y bots',
    desc: 'Sacamos de encima las tareas repetitivas — planillas, cargas, avisos — para que tu equipo se enfoque en lo importante.',
    Icon: BotIcon,
  },
];

export default function Servicios() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal({ threshold: 0.08 });

  return (
    <section id="servicios" className="section-textured section-pad">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 44, maxWidth: 600 }}>
            <div className="section-kicker" />
            <h2 className="section-title">Lo que hacemos</h2>
            <p className="section-sub">Soluciones a medida, del primer prototipo al sistema funcionando en tu negocio.</p>
          </div>
        </div>

        <div ref={gridRef} className="services-grid">
          {SERVICES.map((s, i) => (
            <div key={s.title} style={revealStyle(gridVisible, (i % 3) + 1, 'marcada', { height: '100%' })}>
              <div className="card elev-sm service-card">
                <span className="icon-badge service-icon">
                  <s.Icon />
                </span>
                <div className="service-text">
                  <h3 className="card-title">{s.title}</h3>
                  <p className="card-body">{s.desc}</p>
                  {s.ejemplo && (
                    <Link to={`/portafolio/${s.ejemplo.slug}`} className="service-example">
                      Ver ejemplo: {s.ejemplo.label} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
