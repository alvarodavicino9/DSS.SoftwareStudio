// Casos de portafolio — fuente única para la grilla de Portafolio.jsx (teaser
// recortado) y para la página de detalle de cada caso (CasoDetalle.jsx).
// `cliente` queda en null hasta que haya casos reales publicables (ver
// README). Apenas se complete, tanto la card como la página de detalle
// muestran automáticamente el nombre — no hace falta tocar el JSX.
export const CASOS = [
  {
    slug: 'pedidos-y-stock-en-tiempo-real',
    cliente: null,
    titulo: 'Pedidos y stock sincronizados en tiempo real',
    resumen: 'Sistema Web Progresivo (PWA) sincronizado en tiempo real con base de datos central y alertas de stock bajo.',
    problema: 'Lentitud en la toma de pedidos y gestión manual de stock en planillas propensas a errores.',
    solucion: 'Sistema Web Progresivo (PWA) sincronizado en tiempo real con base de datos central y alertas de stock bajo.',
    resultado: 'Reducción del 55% en el tiempo de carga de datos y cero pedidos perdidos por desincronización.',
  },
  {
    slug: 'plataforma-con-agenda-y-panel-de-administracion',
    cliente: null,
    titulo: 'Plataforma propia con agenda y panel de administración',
    resumen: 'Plataforma web a medida con panel de administración, agenda de turnos y reportes automáticos.',
    problema: 'Falta de una plataforma digital propia para comercializar y gestionar servicios a clientes.',
    solucion: 'Plataforma web a medida con panel de administración, agenda de turnos y reportes automáticos.',
    resultado: 'Automatización total de la agenda de clientes y reducción del trabajo administrativo manual.',
  },
  {
    slug: 'mvp-funcional-en-3-semanas',
    cliente: null,
    titulo: 'De la idea a un MVP funcional en 3 semanas',
    resumen: 'MVP funcional lanzado en 3 semanas, con analítica integrada desde el primer usuario.',
    problema: 'Necesidad de validar un producto de software nuevo sin invertir meses de desarrollo por adelantado.',
    solucion: 'MVP funcional lanzado en 3 semanas, con analítica integrada desde el primer usuario.',
    resultado: 'Validación exitosa del modelo de negocio y primeros usuarios reales en menos de un mes.',
  },
];

export function getCasoBySlug(slug) {
  return CASOS.find((c) => c.slug === slug);
}
