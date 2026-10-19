// Apps propias del estudio — fuente única para la sección "Apps del Estudio"
// (AppsEstudio.jsx). Son productos nuestros, gratis y publicados, NO trabajos
// para un cliente: por eso viven acá y no en casos.js (ver README v17). No
// tienen página de detalle propia; `url` es el link a la app en vivo, que la
// tarjeta abre en pestaña nueva.
// `imagen`: captura de la app en el celular (public/apps/<slug>/N.jpg, mismo
// criterio que public/portfolio/<slug>/N.jpg), vertical, 540px de ancho y JPG
// comprimido — se muestra dentro de un marco de celular en la tarjeta. La
// del anotador es 540x1036: el marco (.app-phone-screen en layout.css) usa
// esa misma proporción para no recortar la captura; si una app nueva trae otra
// proporción, llevarla a 540x1036 o ajustar ese aspect-ratio.
// La primera app del array es la que va destacada; a medida que se sumen
// apps nuevas, se puede volver a mostrar los slots "Próxima app" (hoy ocultos,
// ver PROXIMAS en AppsEstudio.jsx).

// URL real del Anotador de Truco. El sitio además redirige
// dssoftwarestudio.com.ar/anotador acá (ver "redirects" en vercel.json) — si
// cambia, actualizarla en los dos lugares.
export const ANOTADOR_URL = 'https://anotador-truco-five.vercel.app';

export const APPS = [
  {
    slug: 'anotador-de-truco',
    nombre: 'Anotador de Truco',
    resumen: 'Llevá los puntos de tus partidas de truco desde el celular, sin papel ni birome. Lo abrís y a jugar.',
    chips: ['Gratis', 'Sin cuenta', 'Anda en el celular'],
    url: ANOTADOR_URL,
    imagen: '/apps/anotador-de-truco/1.jpg',
    alt: 'Anotador de Truco en un celular: mesa de madera con el puntaje de Nosotros y Ellos dibujado con palitos de fósforo, botones +2 y +3, deshacer, menú y las pestañas Anotador, Historial, Torneo y Señas',
  },
];
