// Los links de sección (#servicios, #contacto...) viven en Nav/Footer/RadialMenu
// y se renderizan en TODAS las páginas (ver App.jsx), no solo en la home. En
// la home un href="#servicios" alcanza (scroll nativo). Fuera de la home
// (ej. una página de caso de portafolio, /portafolio/:slug) hace falta
// anteponer "/" para que el navegador primero navegue a la home y una vez
// ahí busque el id — comportamiento nativo, sin JS extra.
export function sectionHref(hash, currentPath) {
  return currentPath === '/' ? hash : `/${hash}`;
}
