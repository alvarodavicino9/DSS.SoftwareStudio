// Measurement ID real de GA4 (ver README, sección "Pendientes para
// producción" / v12). Antes era un placeholder ("G-XXXXXXXXXX") — mientras
// lo fue, initAnalytics() no cargaba ningún script ni mandaba tráfico.
const GA_MEASUREMENT_ID = 'G-K1CBW4F5DH';

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
