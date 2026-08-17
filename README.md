# DS.SoftwareStudio — sitio web

Landing page de una sola página, construida en **React + Vite** a partir del rediseño 3D
(`DS SoftwareStudio Redesign.dc.html` + handoff `README.md` del bundle de diseño).

## Correr el proyecto

```bash
npm install
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run build      # build de producción en dist/
npm run preview    # sirve el build de producción localmente
```

## Estructura

```
src/
  components/   Nav, Logo, Hero, BackgroundVideo (mouse-scrub), Nosotros, Servicios,
                Proceso, Portafolio, Terminal, Contacto, Footer
                HeroFigure/TechNetwork (three.js) — sin usar desde v4, ver abajo
  hooks/        useReveal (scroll reveal), useReducedMotion, useTypewriter
  utils/        proceduralTextures.js (noise/gradient/sprite canvas textures para three.js,
                usado solo por HeroFigure/TechNetwork), whatsapp.js, analytics.js
  styles/       tokens.css (design tokens), animations.css, layout.css
```

## v2 — rediseño claro + marca del cliente

El sitio pasó de un tema oscuro genérico a la identidad real del cliente:

- **Paleta**: fondo claro (`#f5f6fa`), texto navy oscuro, degradé de marca violeta → cian
  (`#8b7cf6` → `#2fc8db`, sacado del logo) usado en el CTA primario, texto destacado y detalles 3D.
- **Logo** (`src/components/Logo.jsx`): recreado en SVG a partir del archivo del cliente — mark
  `<DSS/>` con el degradé, wordmark y tagline. `variant="mark"` da solo el símbolo (footer, usos
  compactos); default da el lockup completo (nav).
- **Fondo del hero** (`TechNetwork.jsx`): reemplaza el halo de cursor 2D original por una red 3D
  de nodos conectados con pulsos de datos viajando por las conexiones — three.js, carga diferida.
- **Figura 3D** (`HeroFigure.jsx`): materiales con clearcoat + mapa de ruido (textura tipo tela en
  vez de plástico liso), luces de borde en violeta y cian, tiras de circuito emisivas en los
  hombros, y una línea de "pantalla viva" animada bajo los ojos.
- La **terminal** se mantuvo con fondo oscuro a propósito — funciona como un elemento de contraste
  ("pantalla" dentro de una página clara) en vez de desentonar.

El `CursorHalo.jsx` original quedó en el repo sin usar (no se pudo borrar desde acá por permisos
del entorno) — se puede eliminar sin romper nada, ya no se importa en ningún lado.

## v3 — analytics, antispam, botón flotante y tests

- **Google Analytics 4** (`src/utils/analytics.js`): scaffold listo, con un Measurement ID
  placeholder (`G-XXXXXXXXXX`). Mientras sea el placeholder, no carga ningún script ni manda
  tráfico — reemplazalo por el ID real (Admin → Flujos de datos → tu stream web) y se activa solo.
  Ya trackea: click en WhatsApp (nav, nav mobile y botón flotante), click en el CTA principal del
  hero, y envío exitoso del formulario.
- **Antispam honeypot** en `Contacto.jsx`: campo oculto que los bots suelen completar; si llega
  lleno, el formulario "tiene éxito" en silencio sin llegar a pegarle a Formspree — cero fricción
  para usuarios reales.
- **Botón de WhatsApp flotante** (`FloatingWhatsApp.jsx`): aparece una vez que el hero sale de
  vista y se mantiene fijo abajo a la derecha en el resto del scroll.
- **Ícono de marca standalone**: `Logo.jsx` ahora tiene `variant="icon"` (badge cuadrado) y hay un
  `public/icon.svg` para uso externo (referenciado como `mask-icon` para Safari). Para soporte
  completo de "agregar a inicio" en iOS/Android eventualmente conviene exportar también PNG en
  192px/512px — el SVG no cubre ese caso en todos los sistemas.
- **Tests** (`npm test`, Vitest + Testing Library): smoke tests para `Terminal` y `Contacto`
  (incluye el caso del honeypot). 7/7 pasando.

## v4 — A.R.I.A, SEO técnico y performance

- **Hero rediseñado con A.R.I.A** (`Hero.jsx`, `BackgroundVideo.jsx`): el fondo del hero ahora es
  un video local (`public/videos/aria-hero.mp4`) que se "scrubea" con el movimiento del mouse en
  cualquier dirección, en vez de la red 3D de nodos. Reemplaza a `TechNetwork.jsx`/`HeroFigure.jsx`
  en esa sección (los componentes quedan en el repo sin usar, por si se reutilizan en otro lado —
  el bundle ya no incluye three.js gracias a esto, bajó de ~750KB a ~220KB). El video fue
  re-encodeado localmente con keyframes cortos para que el scrub sea liviano — ver
  `public/videos/README.md` para el comando de ffmpeg. El scrubeo se pausa automáticamente
  (IntersectionObserver) en cuanto el hero sale de pantalla, para no competir con el scroll del
  resto de la página.
- **Sección "Cómo Trabajamos"** (`Proceso.jsx`): 4 pasos (Diagnóstico → Propuesta → Desarrollo →
  Entrega & Soporte), entre Servicios y Portafolio. Agregada al Nav.
- **Portafolio listo para clientes reales**: cada caso en `Portafolio.jsx` tiene un campo
  `cliente` (hoy en `null`). Apenas haya nombres publicables, se completa ese campo y la card
  muestra automáticamente el badge — no hace falta tocar el JSX.
- **Reveal sin blur animado**: `useReveal.js` animaba `filter: blur()` en cada sección al entrar
  en scroll — es una de las operaciones más caras que le podés pedir al navegador (fuerza repaint
  en vez de solo composición). Se sacó, quedó solo opacity+transform; se siente notablemente más
  fluido en scroll, sobre todo en equipos más limitados.
- **SEO técnico**: `robots.txt`, `sitemap.xml`, datos estructurados JSON-LD (`ProfessionalService`)
  en `index.html`, y `manifest.json` con íconos PNG (192px/512px, generados a partir de
  `icon.svg`) — con esto queda resuelto el pendiente de v3 sobre "agregar a inicio" en
  iOS/Android. El dominio usado en `robots.txt`/`sitemap.xml`/JSON-LD/canonical es
  `dssoftwarestudio.com.ar` — confirmar que sea el definitivo antes de publicar.

## v5 — tema oscuro, fondo animado, portafolio con páginas propias

- **Tema oscuro + fondo animado** (`AnimatedGradient.jsx`, `tokens.css`): se sacaron los fondos
  blancos/planos de todas las secciones. Hay un degradé animado en WebGL2 (violeta → cian sobre
  navy, colores de marca) fijo detrás de toda la página (montado una sola vez en `App.jsx`, no por
  sección — así solo hay un contexto WebGL en toda la app). Las `.card` pasaron de blanco sólido a
  paneles "glass" (fondo translúcido + `backdrop-filter: blur()`) para que el degradé se note a
  través. Se evaluó también un fondo de partículas (`particles.js` vía CDN) pero se descartó: suma
  un script externo no versionado, está pensado para cubrir solo el hero (no la página completa) y
  rompe con el patrón del proyecto de no depender de librerías de terceros para lo visual (ver
  `Dock.jsx`/`RadialMenu.jsx`/`SpotlightButton.jsx`).
- **Se sacó la sección "Nosotros"** (`Nosotros.jsx` queda en el repo sin usar, mismo criterio que
  `TechNetwork`/`HeroFigure`/`CursorHalo`). El Home ahora vive en `src/pages/Home.jsx`.
- **Portafolio con página propia por caso** (`src/pages/CasoDetalle.jsx`, `src/data/casos.js`): las
  cards de `Portafolio.jsx` ahora muestran el texto recortado (3 líneas) + el resultado, con un link
  "Ver caso completo" a `/portafolio/:slug`. Router propio y liviano en `src/router.jsx`
  (pushState + popstate, sin sumar `react-router` como dependencia — mismo criterio que el resto de
  componentes "portados" del proyecto). Los links de sección (`#servicios`, `#contacto`, etc.) en
  Nav/Footer/RadialMenu siguen siendo anchors nativos; ver `src/utils/sectionHref.js` para cómo
  resuelven cuando no se está en la home.

## v6 — SEO para posicionamiento en Google

- **`useDocumentMeta`** (`src/hooks/useDocumentMeta.js`): el sitio es un SPA con un solo
  `index.html` (ver v5, router propio), así que sin esto Google —y cualquier bot que arma la
  vista previa de un link, como Facebook/WhatsApp/LinkedIn— veía el mismo `<title>`/description/
  Open Graph en la home y en cada caso de portafolio. Este hook actualiza `<title>`, meta
  description, `<link rel="canonical">`, Open Graph/Twitter y (en los casos) un JSON-LD
  `BreadcrumbList`, en cada cambio de ruta. `Home.jsx` lo llama sin argumentos (vuelve al default
  del sitio) y `CasoDetalle.jsx` con el título/resumen de cada caso. Un slug inexistente
  (`/portafolio/no-existe`) pasa `robots: noindex, follow` para que Google no indexe esa URL como
  si fuera un caso real.
- **`public/sitemap.xml`** actualizado con las 3 URLs de casos de portafolio (antes solo tenía la
  home). **Importante**: no se genera solo — si se agrega o saca un caso en `src/data/casos.js`,
  hay que reflejarlo acá a mano.
- **`index.html`**: `og:image`/`twitter:image` pasaron a URL absoluta (`https://dssoftware...`,
  antes `/og-cover.svg` — algunos bots de vista previa no resuelven rutas relativas), se agregó
  `og:url` y `<meta name="robots" content="index, follow">` explícito, y el JSON-LD
  `ProfessionalService` ahora incluye `telephone` (el número de WhatsApp confirmado).
- **Lo que el código no puede hacer** (acciones pendientes del lado de Google, no de código):
  1. Dar de alta el dominio en [Google Search Console](https://search.google.com/search-console),
     verificarlo y enviar `https://dssoftwarestudio.com.ar/sitemap.xml` ahí — es lo que le avisa a
     Google que el sitio existe y hay que revisarlo; nada de esto pasa solo.
  2. Crear/reclamar un perfil de [Google Business Profile](https://www.google.com/business/) para
     DS.SoftwareStudio — ayuda mucho a aparecer arriba en búsquedas locales ("desarrollo de
     software Argentina", etc.) y es lo que muestra el panel con dirección/teléfono/reseñas al
     lado de los resultados.
  3. Aparecer "arriba" en Google no es algo que un cambio de código pueda garantizar: además de
     que estas dos cosas se hagan, depende de que otros sitios linkeen a dssoftwarestudio.com.ar
     (backlinks), de contenido nuevo con el tiempo, y de cuánta competencia haya para esas
     búsquedas. Lo de este v6 es la base técnica correcta — el resto es un proceso, no algo que se
     resuelva en un commit.

## v7 — portafolio con proyectos reales

- **`src/data/casos.js` reemplazado por 3 proyectos reales del estudio**: Torneo Star Basket
  (carga de estadísticas en vivo desde un Excel por partido), un sitio para inmobiliarias
  (publicación de propiedades + panel de administrador) y uno para una veterinaria con pet shop
  (reserva de turnos + panel de administrador). Slugs de portafolio nuevos — `public/sitemap.xml`
  actualizado para que coincidan (si cambiás un slug de nuevo, actualizarlo ahí también).
- **Campo `url` nuevo en cada caso** — el link al sitio en vivo. `CasoDetalle.jsx` lo usa para un
  botón "Ver sitio en vivo" (abre en pestaña nueva, con `trackEvent('portfolio_live_site_click')`
  si GA4 está configurado) al lado del título del caso. La card del portafolio (`Portafolio.jsx`)
  sigue llevando a la página de caso interna como antes — el link externo es adicional, no la
  reemplaza.

## v8 — capturas reales del sitio y carrusel en el portafolio

- **`src/components/Carousel.jsx` nuevo** — carrusel de imágenes genérico y reutilizable: avanza
  solo cada ~4.2s, tiene flechas y puntos de navegación manual, pausa el auto-avance con el mouse
  encima, soporta swipe táctil, y respeta `prefers-reduced-motion` (desactiva el auto-avance del
  todo si el usuario lo tiene activado). Estilos en `tokens.css` bajo `.carousel-*`.
- **Capturas reales de los 3 sitios en vivo** — se sacaron 4 capturas por proyecto directamente de
  cada sitio (torneostarbasket.com.ar, inmobiliarias889-pi.vercel.app, veterinaria-ecru.vercel.app),
  recortadas a 1280x720 (16:9) y comprimidas para web. Viven en
  `public/portfolio/<slug>/1.jpg` … `4.jpg`.
- **Campo `imagenes` nuevo en cada caso de `src/data/casos.js`** — array de rutas a esas capturas.
  `imagenes[0]` se usa como portada fija en la card de `Portafolio.jsx` (con zoom sutil al hover de
  la card); el array completo alimenta el `<Carousel>` en `CasoDetalle.jsx`, mostrado arriba de la
  sección problema/solución/resultado.
- **Si agregás un caso nuevo o cambiás capturas**: las imágenes deben ir en
  `public/portfolio/<slug>/` y listarse en el campo `imagenes` del caso correspondiente en
  `casos.js`. No hay validación automática de que el archivo exista — si el path está mal, el
  `<img>` simplemente no carga (ícono roto).

  > Nota: la decisión de "portada fija, no mini-carrusel" de más abajo se revirtió en v9 — ver
  > esa sección.

## v9 — cards del portafolio: mini-carrusel + inclinación 3D + brillo ambiente

Pedido: la sección de portafolio tenía que sentirse más "futurista y animada", y mostrar mejor
cada proyecto — sobre todo pensando en que van a agregarse más de 3 casos con el tiempo, así que
cada card necesitaba comunicar "hay más para ver acá" sin depender de que el usuario entre al
detalle.

- **`src/components/PortfolioCard.jsx` nuevo** — se separó la card del portafolio de
  `Portafolio.jsx` a su propio componente porque ahora tiene dos animaciones corriendo a la vez que
  necesitan vivir en elementos distintos (ver comentario al inicio del archivo):
  1. El reveal de entrada al hacer scroll (ya existía, vía `useReveal`/`revealStyle`, controlado
     por React state).
  2. La inclinación 3D que sigue al mouse — mutada directo sobre el DOM con
     `element.style.setProperty(...)` en el `mousemove`, sin pasar por React state, para que el
     seguimiento del cursor sea fluido y no dispare un re-render en cada pixel de movimiento.
  Mezclar las dos en el mismo elemento hacía que la transform de una pisara a la otra.
- **Reversión de la decisión de v8**: en vez de una imagen de portada fija, cada card ahora tiene
  el `<Carousel>` completo (en modo `compact`) con las 4 fotos del proyecto rotando solas — con
  más de 3 proyectos en la grilla, mostrar movimiento en cada card es justamente lo que hace notar
  que hay más contenido detrás de cada uno, en vez de competir por atención con un solo hover.
- **`Carousel.jsx` — prop `compact` nueva**: para cuando el carrusel vive dentro de otro elemento
  clickeable (acá, la card entera es un `<Link>`). En modo compacto las flechas/puntos son más
  chicos y quedan ocultos hasta hacer hover sobre la imagen (no compiten visualmente con el resto
  de la card en reposo). Los botones del carrusel ahora siempre frenan la propagación del click
  (`stopPropagation` + `preventDefault`) — si no, tocar una flecha dentro de la card navegaría al
  caso en vez de solo cambiar de foto.
- **Ken Burns sutil en la foto activa**: un `scale` lento (7s, `ease-in-out infinite alternate`)
  solo en la slide que se está mostrando — le da vida a la imagen incluso en el rato entre un
  cambio de foto y el siguiente. Se corta con `prefers-reduced-motion` como todo lo demás.
- **Brillo ambiente que sigue al cursor** (`.portfolio-spotlight`): mismo lenguaje visual que el
  glow del fondo animado (`TechBackground.jsx`) y del hero, pero a escala de card — un radial
  gradient posicionado con las mismas coordenadas del mouse que usa el tilt (`--spot-x`/`--spot-y`
  como custom properties CSS). Vive detrás del contenido gracias a `isolation: isolate` +
  `z-index: -1` en `.portfolio-card` (así el glow no tapa el texto pero tampoco se escapa a
  ancestros fuera de la card).
- **Barra de acento con degradé animado**: `.portfolio-accent` (la barrita de color arriba de cada
  card) ahora tiene un `background-position` animado en loop (`accent-flow`, 4s linear) además de
  seguir expandiéndose al 100% del ancho en hover, como ya hacía.
- **CTA "Ver caso completo →"**: la flecha ahora tiene su propia transición y se desliza a la
  derecha en hover (`.portfolio-cta svg`), en vez de ser parte del texto plano.
- **Performance**: el tilt usa `getBoundingClientRect()` + `style.setProperty` directo (no
  `setState`) específicamente para evitar re-renderizar toda la card (imagen, texto, carrusel) en
  cada evento de `mousemove` — con 3+ cards en pantalla, hacerlo con React state hubiera sido
  notablemente menos fluido.

## v10 — barra de navegación: vidrio oscuro en vez del bloque de degradé sólido

Se sentía "pegada encima" del resto del sitio: era el único resto del tema claro de v2 que nunca
se actualizó cuando todo pasó a oscuro en v5 — un bloque de color sólido y opaco, mientras que
cards/terminal/selector usan paneles de vidrio translúcido con blur. El corte contra las secciones
oscuras de abajo era particularmente duro (borde recto, sin transición).

- **`Nav.jsx`**: el fondo pasó de `background: var(--gradient-brand)` (sólido) a una clase
  `.site-nav` (en `layout.css`) con `rgba(6, 7, 13, 0.72)` + `backdrop-filter: blur(20px)` — mismo
  criterio que `.card`/`.mobile-menu`. Como `<Nav>` no está dentro de `#hero-section`, sus custom
  properties de color siempre resuelven al tema oscuro global sin importar qué sección esté atrás
  — por eso la barra se ve igual de bien tanto sobre el Hero (que sigue siendo claro a propósito,
  ver v5/comentario en `Hero.jsx`) como sobre las secciones oscuras.
- **El degradé de marca no desapareció** — quedó como una línea de 2px animada en el borde
  inferior de la barra (`.site-nav::after`, reusa el keyframe `accent-flow` que ya tienen las
  cards de portafolio desde v9), así la identidad de color se sigue viendo sin volver a competir
  con el contenido como bloque grande.
- **`.nav-dock`/`.dock-item`** (el dock de íconos del menú desktop): pasaron de un pill blanco
  translúcido (pensado para contrastar contra el degradé sólido de antes) a vidrio oscuro
  (`var(--color-surface)` + borde), consistente con el resto de la UI.
- **Lo que NO se tocó, a propósito**: el botón `+` del menú radial mobile (`RadialMenu.jsx`) se
  queda blanco sólido — ya estaba pensado como "chip flotante" que contrasta contra cualquier
  fondo, y sigue funcionando igual de bien sobre la barra oscura. El logo sigue usando su variante
  clara (`light`) porque blanco lee bien tanto sobre la barra oscura como sobre el Hero claro
  detrás — no hacía falta una segunda variante de color.

## Pendientes para producción

Estas son las cosas que el diseño dejaba abiertas y que hay que terminar de resolver:

1. ~~**Formspree**~~ — resuelto: el formulario de contacto (`src/components/Contacto.jsx`) ya
   apunta al endpoint real, `https://formspree.io/f/xrpzyvgr`. Verificado end-to-end (interceptando
   la request en Playwright) que el POST sale con el JSON correcto y muestra el mensaje de éxito.
   Si en algún momento hay que rotarlo (form nuevo, otra cuenta de Formspree), el endpoint nuevo
   se pega en la constante `FORMSPREE_ENDPOINT` al principio de `Contacto.jsx`.

2. ~~**WhatsApp**~~ — confirmado: `+549 3491687912` es el número real de WhatsApp Business. El botón
   flotante (`FloatingWhatsApp.jsx`) ahora abre un mini-chat con opciones rápidas antes de mandar
   a `https://wa.me/5493491687912`.

3. ~~**Casos de portafolio**~~ — resuelto: los 3 casos de `src/data/casos.js` son proyectos reales
   del estudio, con link al sitio en vivo (ver v7 abajo). `cliente` sigue en `null` en los tres —
   son proyectos propios/productizados, no encargos con un cliente nombrado; completarlo si en
   algún momento corresponde.

4. **GA4** — falta pegar el Measurement ID real (ver arriba).

5. ~~**Dominio real**~~ — confirmado: `dssoftwarestudio.com.ar` es el definitivo.
   `robots.txt`/`sitemap.xml`/canonical/JSON-LD ya asumen ese dominio (ver v6 arriba).

6. **Search Console + Google Business Profile** — ver v6 arriba. Ninguna de las dos se puede hacer
   desde el código: hay que darlos de alta a mano con una cuenta de Google del negocio.

7. **Rewrite del hosting para `/portafolio/:slug`** — el sitio ahora tiene rutas de página real
   (router propio en `src/router.jsx`, ver v5 abajo). `npm run build` sigue generando un solo
   `dist/index.html` (SPA), así que quien sirva el build en producción tiene que redirigir
   cualquier ruta no encontrada a `index.html` (ej. `_redirects` con `/* /index.html 200` en
   Netlify, o `rewrites` en `vercel.json`) — si no, entrar directo a
   `dssoftwarestudio.com.ar/portafolio/algun-caso` (o refrescar esa página) da 404. En local con
   `npm run dev` funciona sin nada extra porque Vite ya resuelve esto solo.

## Decisiones de implementación

- **prefers-reduced-motion**: implementado. Desactiva el paralaje del hero, la rotación idle de
  la figura 3D y los reveals con blur — los elementos aparecen directamente en su estado final.
- **Menú mobile**: el prototipo original solo ocultaba los links bajo 700px. Acá se agregó un
  menú hamburguesa real y funcional (`Nav.jsx`).
- **Terminal**: además de los 5 botones del diseño, se agregó un input de texto libre real
  (el diseño ya soportaba comandos arbitrarios en la lógica, solo faltaba el input).
- **SEO/social**: meta description, Open Graph, Twitter card y favicon agregados en `index.html`
  y `public/`.
