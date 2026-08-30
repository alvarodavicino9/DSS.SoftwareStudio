// Casos de portafolio — fuente única para la grilla de Portafolio.jsx (teaser
// recortado) y para la página de detalle de cada caso (CasoDetalle.jsx).
// Proyectos reales del estudio (reemplazan los casos genéricos de antes — ver
// README v7). `url` es el link al sitio en vivo; CasoDetalle.jsx lo usa para
// el botón "Ver sitio en vivo" (se abre en pestaña nueva). `cliente` sigue en
// null: son proyectos propios/productizados, no encargos con un cliente
// nombrado — si en algún momento hay uno, completarlo ahí.
// `imagenes`: capturas reales del sitio en vivo (public/portfolio/<slug>/N.jpg,
// recortadas a 1280x720 / 16:9). imagenes[0] se usa como portada fija en la
// card de Portafolio.jsx; el arreglo completo alimenta el <Carousel> de
// CasoDetalle.jsx (ver README v8).
// `funcionalidades` y `stack` (ver README v13): detalle técnico de qué incluye
// cada proyecto y con qué se construyó — CasoDetalle.jsx los muestra en una
// sección "Qué incluye" con bullets + chips. Se sacaron revisando el código
// real de cada proyecto (carpetas locales del usuario), no son genéricos.
export const CASOS = [
  {
    slug: 'torneo-star-basket-estadisticas-en-vivo',
    cliente: null,
    titulo: 'Plataforma de estadísticas en vivo para un torneo de básquet',
    resumen: 'Sitio web para un torneo de básquet con carga y visualización de estadísticas en vivo de cada partido.',
    problema: 'Es un torneo real de básquet en Córdoba, con categoría masculina y femenina, varios equipos y partidos por fecha. Las estadísticas se cargaban a mano después de cada partido, jugador por jugador — lento, con margen de error, y sin ningún lugar público donde jugadores y familias pudieran seguir el torneo en tiempo real.',
    solucion: 'Carga de la planilla del partido en Excel, con importación automática a la base de datos, sin que nadie tenga que tipear un número. Sobre esa base se construyó además una experiencia pensada para los fans: perfiles de jugador, comparativas por partido, predicciones y acceso directo a la transmisión en vivo.',
    resultado: 'El torneo tiene hoy un sitio propio en producción (torneostarbasket.com.ar) con estadísticas, fixture y posiciones de ambas categorías siempre al día apenas termina cada partido, más funciones de fan engagement que no estaban en el pedido original.',
    url: 'https://www.torneostarbasket.com.ar/',
    funcionalidades: [
      'Estadísticas en vivo por jugador y por equipo: puntos, rebotes, asistencias, robos, tapones, tiros de 1, 2 y 3 puntos, y faltas',
      'Carga de la planilla del partido en Excel, con importación automática a la base de datos',
      'Fixture, resultados y tabla de posiciones, separados por categoría masculina y femenina',
      'Ficha de partido ("Game Center") con el resultado, el desglose por cuarto y los goleadores destacados',
      'Perfil de cada jugador con gráfico de evolución de puntos partido a partido',
      'Encuestas de predicción antes de cada partido ("¿quién gana?"), con los resultados en porcentaje',
      'Tarjetas de equipo animadas en 3D con el escudo y el récord de cada franquicia',
      'Acceso directo a la transmisión en vivo del torneo por YouTube',
      'Instalable como app desde el navegador (PWA), con ícono propio en el celular',
    ],
    stack: ['React', 'Vite', 'Supabase', 'Excel (xlsx)', 'Recharts', 'PWA'],
    imagenes: [
      '/portfolio/torneo-star-basket-estadisticas-en-vivo/1.jpg',
      '/portfolio/torneo-star-basket-estadisticas-en-vivo/2.jpg',
      '/portfolio/torneo-star-basket-estadisticas-en-vivo/3.jpg',
      '/portfolio/torneo-star-basket-estadisticas-en-vivo/4.jpg',
    ],
  },
  {
    slug: 'sitio-web-para-inmobiliarias',
    cliente: null,
    titulo: 'Sitio web para inmobiliarias con panel de administración',
    resumen: 'Plataforma web para inmobiliarias: publicación de propiedades en alquiler y venta, con panel de administración propio.',
    problema: 'La mayoría de las inmobiliarias publican solo en portales de terceros (Zonaprop, ArgenProp, MercadoLibre) y no tienen una web propia que transmita confianza y les permita captar el contacto directo, sin competir al lado de cientos de otros avisos.',
    solucion: 'Una plantilla propia del estudio, lista para personalizar rápido con la marca y las propiedades de cada inmobiliaria: catálogo con filtros avanzados, mapa interactivo, favoritos y un panel de administración para manejar las publicaciones sin depender de un programador.',
    resultado: 'Base de producto que pasa de demo a sitio de un cliente real en días, no en semanas — se cambia la marca, se cargan las propiedades y ya está lista para ofrecerse a cualquier inmobiliaria.',
    url: 'https://inmobiliarias889-pi.vercel.app/',
    funcionalidades: [
      'Catálogo de propiedades con filtros por operación (venta o alquiler), tipo, barrio, ambientes y presupuesto',
      'Vista en grilla o en mapa interactivo, con cada propiedad ubicada geográficamente',
      'Ficha de propiedad con galería de fotos, datos completos, ubicación y propiedades relacionadas',
      'Favoritos: guardar propiedades para comparar más tarde, sin necesidad de crear una cuenta',
      'Panel de administración para publicar, editar y dar de baja propiedades sin tocar código',
      'Home con video ambiente y scroll cinematográfico, al estilo de un showcase inmobiliario premium',
      'Transiciones animadas entre páginas y scroll suave en todo el recorrido del sitio',
      'Selector de moneda para mostrar los precios en distintas divisas',
      'Formulario de contacto listo para conectar a email, WhatsApp o un CRM',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'GSAP', 'Leaflet (mapas)'],
    imagenes: [
      '/portfolio/sitio-web-para-inmobiliarias/1.jpg',
      '/portfolio/sitio-web-para-inmobiliarias/2.jpg',
      '/portfolio/sitio-web-para-inmobiliarias/3.jpg',
      '/portfolio/sitio-web-para-inmobiliarias/4.jpg',
    ],
  },
  {
    slug: 'veterinaria-y-pet-shop-turnos-online',
    cliente: null,
    titulo: 'Sitio web para veterinaria y pet shop con reserva de turnos',
    resumen: 'Plataforma para una veterinaria con pet shop: reserva de turnos online y panel de administración completo.',
    problema: 'Una veterinaria con pet shop necesitaba digitalizar dos cosas a la vez: la reserva de turnos (que antes era todo por teléfono o WhatsApp, coordinando a mano) y la venta de sus productos, sin depender de un local físico para cada consulta o cada compra.',
    solucion: 'Un sitio único que combina tienda online con stock en tiempo real y un asistente de reserva de turnos en 3 pasos, más un panel para que el equipo de la veterinaria gestione turnos, pedidos y productos desde un solo lugar, sin tocar código.',
    resultado: 'Un cliente puede reservar un turno o comprar un producto sin llamar por teléfono, y el equipo de la veterinaria ve todo — turnos del día, pedidos y stock — desde un panel propio.',
    url: 'https://veterinaria-ecru.vercel.app/',
    funcionalidades: [
      'Tienda online con categorías (alimento, ropa, accesorios, higiene, juguetes, salud), filtros por mascota y búsqueda',
      'Stock en tiempo real, con avisos de "sin stock" o "últimas unidades" en cada producto',
      'Carrito de compra lateral y checkout con retiro en el local o envío a domicilio',
      'Asistente de reserva de turnos en 3 pasos (servicio, fecha/hora y datos de la mascota), respetando los horarios reales de atención',
      'Código de turno para confirmarlo por WhatsApp o agregarlo directo a Google Calendar',
      'Gestión de turno propia: el cliente lo busca con el código y su email, y lo cancela o reprograma sin llamar',
      'Botón flotante de WhatsApp con estado "disponible ahora" según el horario real, y accesos rápidos (turno, pedido, urgencia)',
      'Panel para el equipo de la veterinaria con login propio: turnos (lista y calendario semanal), pedidos, y stock/precios de cada producto',
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zustand'],
    imagenes: [
      '/portfolio/veterinaria-y-pet-shop-turnos-online/1.jpg',
      '/portfolio/veterinaria-y-pet-shop-turnos-online/2.jpg',
      '/portfolio/veterinaria-y-pet-shop-turnos-online/3.jpg',
      '/portfolio/veterinaria-y-pet-shop-turnos-online/4.jpg',
    ],
  },
  {
    slug: 'hipermat-corralon-materiales-construccion',
    cliente: 'Hipermat Rosario',
    titulo: 'Sitio web para Hipermat, corralón de materiales de construcción',
    resumen: 'Sitio institucional y catálogo para Hipermat, corralón de materiales de construcción en Rosario con más de 40 años en el rubro.',
    problema: 'Hipermat es un corralón real con más de 40 años en Rosario, pero no tenía web propia — dependía solo del boca en boca y las redes, sin forma de mostrar su catálogo ni de recibir consultas fuera del horario de atención.',
    solucion: 'Un sitio a medida con la identidad de marca de Hipermat, con catálogo de productos por categoría, carrito de pedido y un backend propio en Node que sirve los productos y procesa los contactos — todo armado para que el pedido termine confirmándose por WhatsApp, sin fricción para el cliente.',
    resultado: 'Hipermat tiene hoy una web propia en producción (hipermatrosario.com.ar) con presentación institucional, catálogo y un canal de contacto directo por WhatsApp disponible las 24 horas, con despliegue automático en Netlify ante cada cambio.',
    url: 'https://www.hipermatrosario.com.ar/',
    funcionalidades: [
      'Catálogo de productos por categoría con buscador',
      'Carrito de pedido con notas por producto, y envío del pedido armado directo por WhatsApp',
      'Backend propio en Node/Express que sirve el catálogo de productos y procesa los mensajes de contacto',
      'Formulario de contacto que arma el mensaje de WhatsApp con los datos cargados',
      'Página de servicios con los diferenciales del negocio: envíos, asesoramiento, cotizaciones, mayorista y minorista',
      'Sección "Quiénes somos" con la trayectoria de más de 40 años y ubicación con mapa interactivo',
      'Botón flotante de WhatsApp y despliegue automático en Netlify con cada cambio',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'Netlify'],
    imagenes: [
      '/portfolio/hipermat-corralon-materiales-construccion/1.jpg',
      '/portfolio/hipermat-corralon-materiales-construccion/2.jpg',
      '/portfolio/hipermat-corralon-materiales-construccion/3.jpg',
      '/portfolio/hipermat-corralon-materiales-construccion/4.jpg',
    ],
  },
  {
    slug: 'ds-burguer-menu-online-con-pedidos',
    cliente: null,
    titulo: 'Plataforma de pedidos online con panel de administración para hamburgueserías',
    resumen: 'Sitio y sistema de pedidos online para una hamburguesería, con menú personalizable, carrito, checkout por WhatsApp y un panel de administración completo.',
    problema: 'Muchas hamburgueserías y locales de comida toman pedidos por WhatsApp a mano, sin un menú navegable online, sin poder personalizar cada producto (tamaño, extras) y sin ningún panel para ver ventas, gestionar pedidos o el menú sin tocar código.',
    solucion: 'Una plataforma propia del estudio: menú navegable con búsqueda y categorías, cada producto personalizable (tamaño, extras opcionales) con el precio actualizándose en vivo, carrito con checkout que arma automáticamente el pedido para WhatsApp, y un panel de administración completo (pedidos, menú, delivery, contenido del sitio y estadísticas de venta) funcionando sin depender de un backend externo.',
    resultado: 'Base de producto lista para ofrecer a cualquier hamburguesería o local de comida: se personaliza el menú, los precios y la marca desde el propio panel de administración, y en minutos queda lista para tomar pedidos reales por WhatsApp — con arquitectura preparada para conectar un backend compartido (Supabase) el día que el negocio necesite compartir datos entre varios dispositivos.',
    url: 'https://proyecto-fuegos-phi.vercel.app/',
    funcionalidades: [
      'Menú navegable por categorías con buscador',
      'Personalización de producto en el momento: tamaño y extras opcionales, con el precio recalculándose en vivo',
      'Carrito de compra con checkout: retiro en el local o delivery (con zona y horario) y método de pago (efectivo o transferencia)',
      'Al confirmar, arma automáticamente el pedido para WhatsApp con todo el detalle listo para enviar',
      'Panel de administración con login propio: gestión de pedidos por estado (nuevo, preparando, en camino, entregado)',
      'Gestión de menú desde el panel: crear, editar y borrar productos y categorías, subir fotos y marcar "agotado" sin tocar código',
      'Gestión de zonas y costos de delivery, y horarios de entrega, editables desde el panel',
      'Estadísticas de venta con gráficos propios: ventas por período, ticket promedio, tendencia y ranking de productos más pedidos',
      'Contenido del sitio (nombre, WhatsApp, dirección, horarios) editable desde el panel, sin tocar código',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'GSAP', 'Three.js'],
    imagenes: [
      '/portfolio/ds-burguer-menu-online-con-pedidos/1.jpg',
      '/portfolio/ds-burguer-menu-online-con-pedidos/2.jpg',
      '/portfolio/ds-burguer-menu-online-con-pedidos/3.jpg',
      '/portfolio/ds-burguer-menu-online-con-pedidos/4.jpg',
    ],
  },
];

export function getCasoBySlug(slug) {
  return CASOS.find((c) => c.slug === slug);
}
