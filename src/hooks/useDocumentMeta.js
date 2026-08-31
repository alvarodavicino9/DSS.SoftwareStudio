import { useEffect } from 'react';

// SPA de una sola página HTML (ver README, v5) — sin esto, Google (y
// cualquier bot que lea el <head> antes de ejecutar JS, como los de
// Facebook/WhatsApp/LinkedIn al armar la vista previa de un link) ve el
// mismo <title>/description/og:* en la home y en cada caso de portafolio,
// porque todos comparten el index.html. Esto los actualiza en cada cambio
// de ruta. No reemplaza tener cada URL listada en public/sitemap.xml (eso
// es lo que le avisa a Google que la página existe) — esto es lo que
// determina cómo se ve una vez que la encuentra o cuando alguien comparte
// el link.
const SITE_URL = 'https://dssoftwarestudio.com.ar';
const DEFAULT_TITLE = 'DS.SoftwareStudio — Software a medida, Argentina';
const DEFAULT_DESCRIPTION =
  'Consultora de software argentina. Desarrollamos sistemas a medida, plataformas web, PWAs y MVPs. Trato directo con los ingenieros que programan tu proyecto.';
const DEFAULT_IMAGE = `${SITE_URL}/og-cover.svg`;

function setMetaByName(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setBreadcrumbJsonLd(items) {
  const id = 'route-breadcrumb-jsonld';
  let el = document.getElementById(id);
  if (!items || items.length === 0) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

/**
 * Sincroniza <title>, meta description, canonical, Open Graph/Twitter y (si
 * se pasa) un BreadcrumbList JSON-LD con la ruta actual. Llamar una vez por
 * página (Home.jsx, CasoDetalle.jsx) — los valores omitidos vuelven al
 * default del sitio, así que navegar de un caso de vuelta a "/" resetea todo
 * solo con no pasar `title`/`description`.
 *
 * `image` es opcional y acepta una ruta relativa al sitio (ej.
 * `/portfolio/hipermat.../1.jpg`, como vienen en `casos.imagenes`) o una URL
 * absoluta — sin esto, compartir el link de un caso puntual (Whatsapp,
 * LinkedIn, etc.) mostraba siempre la imagen genérica de portada del sitio
 * en vez de una captura del proyecto.
 */
export function useDocumentMeta({ title, description, path = '/', robots = 'index, follow', breadcrumb, image } = {}) {
  useEffect(() => {
    const finalTitle = title || DEFAULT_TITLE;
    const finalDescription = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path}`;
    const finalImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE;

    document.title = finalTitle;
    setMetaByName('description', finalDescription);
    setMetaByName('robots', robots);
    setMetaByProperty('og:title', finalTitle);
    setMetaByProperty('og:description', finalDescription);
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:image', finalImage);
    setMetaByName('twitter:title', finalTitle);
    setMetaByName('twitter:description', finalDescription);
    setMetaByName('twitter:image', finalImage);
    setCanonical(url);
    setBreadcrumbJsonLd(breadcrumb);

    return () => setBreadcrumbJsonLd(null);
  }, [title, description, path, robots, breadcrumb, image]);
}
