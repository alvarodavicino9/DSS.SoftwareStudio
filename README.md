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

## Pendientes para producción

Estas son las cosas que el diseño dejaba abiertas y que hay que terminar de resolver:

1. **Formspree** — el formulario de contacto (`src/components/Contacto.jsx`) apunta a
   `https://formspree.io/f/YOUR_FORM_ID`. Hay que:
   - Crear una cuenta gratis en [formspree.io](https://formspree.io) con el email real de contacto.
   - Crear un formulario nuevo ahí y copiar la URL que te dan (`https://formspree.io/f/xxxxxxx`).
   - Reemplazar `FORMSPREE_ENDPOINT` en `Contacto.jsx` por esa URL.
   - Hasta entonces el formulario funciona (loading/success/error) pero el envío falla porque
     el endpoint es un placeholder — el usuario ve el mensaje de error con el email de fallback.

2. ~~**WhatsApp**~~ — confirmado: `+549 3491687912` es el número real de WhatsApp Business. El botón
   flotante (`FloatingWhatsApp.jsx`) ahora abre un mini-chat con opciones rápidas antes de mandar
   a `https://wa.me/5493491687912`.

3. **Casos de portafolio** — siguen siendo genéricos. La estructura ya soporta nombre de cliente
   (`cliente` en cada caso de `src/data/casos.js`, hoy en `null`) — falta completarlo cuando haya
   casos reales publicables.

4. **GA4** — falta pegar el Measurement ID real (ver arriba).

5. **Dominio real** — `robots.txt`, `sitemap.xml`, el `<link rel="canonical">` y el JSON-LD en
   `index.html` asumen `dssoftwarestudio.com.ar`. Confirmar que sea el dominio definitivo (o
   ajustarlo) antes de publicar.

6. **Rewrite del hosting para `/portafolio/:slug`** — el sitio ahora tiene rutas de página real
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
