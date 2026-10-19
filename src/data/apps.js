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
// `funcionalidades` y `stack`: detalle de qué incluye la app y con qué está hecha,
// que la tarjeta muestra en un bloque "Qué incluye" (mismo criterio que
// casos.js). Salen de revisar el código real de la app (anotadorTrucoWebApp),
// no son genéricos: si la app cambia, actualizarlos acá.
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
    resumen:
      'Anotador de puntos para truco pensado para jugar desde el celular, sin papel ni birome. Cada punto se dibuja como un palito de fósforo sobre una mesa de madera, con partidas a 18, 24 o 30, historial de manos y un armador de torneos con llaves eliminatorias. Lo abrís, lo instalás si querés, y a jugar.',
    chips: ['Gratis', 'Sin cuenta', 'Anda en el celular', 'Funciona sin conexión'],
    funcionalidades: [
      'Marcador con palitos de fósforo: cada punto cae en su lugar y cada cinco forman el cuadrado clásico del truco',
      'Partidas a 18, 24 o 30 puntos, con las mitades Malas y Buenas, equipos con nombre propio y pantalla de ganador con revancha',
      'Suma de 1, 2 o 3 puntos por toque, deshacer la última mano, falta envido calculada y conteo de punta y hacha',
      'Historial con todas las manos de la partida en curso y los puntos que sumó cada equipo',
      'Modo torneo de 4 u 8 equipos: sorteo de llaves eliminatorias, cada partido se juega en el mismo anotador, el ganador avanza solo y se corona al campeón',
      'Diccionario de señas tradicionales del truco para consultar durante la partida',
      'Sonido de madera y vibración al sumar (se puede silenciar) y pantalla encendida durante todo el juego',
      'Instalable como app y con uso sin conexión; la partida y el torneo se guardan en el dispositivo, así no se pierde nada si se cierra',
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'PWA'],
    url: ANOTADOR_URL,
    imagen: '/apps/anotador-de-truco/1.jpg',
    alt: 'Anotador de Truco en un celular: mesa de madera con el puntaje de Nosotros y Ellos dibujado con palitos de fósforo, botones +2 y +3, deshacer, menú y las pestañas Anotador, Historial, Torneo y Señas',
  },
];
