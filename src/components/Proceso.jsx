import { useReveal, revealStyle } from '../hooks/useReveal';

const STEPS = [
  {
    n: '01',
    title: 'Diagnóstico',
    desc: 'Una llamada breve para entender tu problema real, cómo trabajás hoy y qué resultado necesitás — sin tecnicismos.',
  },
  {
    n: '02',
    title: 'Propuesta',
    desc: 'Alcance, tiempos y costo por escrito antes de arrancar. Sin letra chica ni sorpresas a mitad de camino.',
  },
  {
    n: '03',
    title: 'Desarrollo',
    desc: 'Avances que podés probar cada semana. Ves el proyecto crecer y podés ajustar el rumbo mientras lo construimos.',
  },
  {
    n: '04',
    title: 'Entrega y soporte',
    desc: 'Lo publicamos, te enseñamos a usarlo y te seguimos acompañando después del lanzamiento.',
  },
];

// v19: en escritorio, cuatro tarjetas unidas por una línea (se lee como un
// recorrido, no como cuatro cajas sueltas); en el celular, una línea de tiempo
// vertical compacta en vez de cuatro tarjetas grandes apiladas.
export default function Proceso() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible] = useReveal({ threshold: 0.08 });

  return (
    <section id="proceso" className="section-textured section-alt section-pad">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headerRef} style={revealStyle(headerVisible, 0)}>
          <div className="section-header" style={{ marginBottom: 44, maxWidth: 600 }}>
            <div className="section-kicker" />
            <h2 className="section-title">Cómo trabajamos</h2>
            <p className="section-sub">Cuatro pasos simples, siempre hablando directo con quienes escriben el código.</p>
          </div>
        </div>

        <ol ref={gridRef} className="process-list">
          {STEPS.map((step, i) => (
            <li key={step.n} className="process-item" style={revealStyle(gridVisible, i + 1, 'marcada')}>
              <span className="step-badge process-badge">{step.n}</span>
              <div className="card elev-sm process-card">
                <h3 className="card-title">{step.title}</h3>
                <p className="card-body">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
