// TODO(cliente): reemplazar por el Measurement ID real de GA4 (Admin → Flujos de
// datos → tu stream web → Measurement ID, formato "G-XXXXXXXXXX").
// Mientras el ID sea el placeholder de abajo, initAnalytics() no hace nada —
// no se carga ningún script ni se manda tráfico a Google.
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

let initialized = false;

function isConfigured() {
  return !GA_MEASUREMENT_ID.includes('XXXX');
}

/** Injects gtag.js once. No-op until a real Measurement ID is set above. */
export function initAnalytics() {
  if (initialized || typeof window === 'undefined' || !isConfigured()) return;
  initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

/** Fires a GA4 event. Silently does nothing if analytics isn't configured yet. */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
