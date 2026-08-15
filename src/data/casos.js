// Casos de portafolio — fuente única para la grilla de Portafolio.jsx (teaser
// recortado) y para la página de detalle de cada caso (CasoDetalle.jsx).
// Proyectos reales del estudio (reemplazan los casos genéricos de antes — ver
// README v7). `url` es el link al sitio en vivo; CasoDetalle.jsx lo usa para
// el botón "Ver sitio en vivo" (se abre en pestaña nueva). `cliente` sigue en
// null: son proyectos propios/productizados, no encargos con un cliente
// nombrado — si en algún momento hay uno, completarlo ahí.
export const CASOS = [
  {
    slug: 'torneo-star-basket-estadisticas-en-vivo',
    cliente: null,
    titulo: 'Plataforma de estadísticas en vivo para un torneo de básquet',
    resumen: 'Sitio web para un torneo de básquet con carga y visualización de estadísticas en vivo de cada partido.',
    problema: 'La carga de estadísticas de cada partido se hacía a mano, jugador por jugador — lento y con margen de error.',
    solucion: 'Sistema que recibe el Excel con las estadísticas de cada partido y las sube solo a la base de datos, publicándolas en la web sin carga manual.',
    resultado: 'Estadísticas individuales de cada jugador y equipo disponibles automáticamente apenas termina el partido.',
    url: 'https://www.torneostarbasket.com.ar/',
  },
  {
    slug: 'sitio-web-para-inmobiliarias',
    cliente: null,
    titulo: 'Sitio web para inmobiliarias con panel de administración',
    resumen: 'Plataforma web para inmobiliarias: publicación de propiedades en alquiler y venta, con panel de administración propio.',
    problema: 'Las inmobiliarias necesitan una web propia para publicar sus propiedades, en vez de depender solo de portales de terceros.',
    solucion: 'Sitio listo para ofrecer a clientes del rubro: publicación de propiedades en alquiler y venta, más un panel de administrador para manejar toda la página.',
    resultado: 'Producto listo para ofrecer a inmobiliarias, con control total de las publicaciones desde un panel propio.',
    url: 'https://inmobiliarias889-pi.vercel.app/',
  },
  {
    slug: 'veterinaria-y-pet-shop-turnos-online',
    cliente: null,
    titulo: 'Sitio web para veterinaria y pet shop con reserva de turnos',
    resumen: 'Plataforma para una veterinaria con pet shop: reserva de turnos online y panel de administración completo.',
    problema: 'Una veterinaria con pet shop necesitaba digitalizar la reserva de turnos y la gestión de su calendario.',
    solucion: 'Sistema de reserva de turnos con automatización de calendario, más un panel de administrador para manejar toda la página.',
    resultado: 'Turnos gestionados automáticamente y control total de la página desde un panel propio.',
    url: 'https://veterinaria-ecru.vercel.app/',
  },
];

export function getCasoBySlug(slug) {
  return CASOS.find((c) => c.slug === slug);
}
