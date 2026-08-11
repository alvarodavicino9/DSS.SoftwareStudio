import { WHATSAPP_URL } from '../utils/whatsapp';
import { trackEvent } from '../utils/analytics';

/**
 * Persistent floating WhatsApp button — visible from the moment the page
 * loads (the nav no longer has its own WhatsApp button, so this is the only
 * entry point) and stays fixed bottom-right through the whole page.
 */
export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { location: 'floating_button' })}
      aria-label="Escribinos por WhatsApp"
      className="floating-whatsapp"
    >
      <span className="floating-whatsapp-ring" aria-hidden="true" />
      <svg viewBox="0 0 32 32" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fill="#fff"
          d="M16.004 3C9.096 3 3.5 8.596 3.5 15.504c0 2.474.72 4.78 1.964 6.72L3.5 29l6.94-1.912a12.42 12.42 0 0 0 5.564 1.318h.005c6.907 0 12.503-5.596 12.503-12.503C28.512 8.596 22.916 3.005 16.004 3Zm0 22.87a10.33 10.33 0 0 1-5.264-1.442l-.378-.224-3.918 1.08 1.05-3.82-.246-.393a10.31 10.31 0 0 1-1.582-5.5c0-5.702 4.638-10.34 10.343-10.34 5.702 0 10.34 4.638 10.34 10.34 0 5.703-4.638 10.3-10.345 10.3Zm5.67-7.735c-.31-.155-1.835-.906-2.12-1.01-.284-.104-.492-.155-.7.155-.207.31-.803 1.01-.985 1.218-.181.207-.362.233-.673.078-.31-.155-1.309-.483-2.494-1.54-.922-.822-1.545-1.837-1.726-2.147-.181-.31-.02-.478.136-.632.14-.14.31-.362.465-.543.156-.181.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.155-.7-1.687-.96-2.31-.253-.605-.51-.524-.7-.533l-.596-.01c-.207 0-.543.078-.828.388-.284.31-1.085 1.06-1.085 2.585 0 1.526 1.11 3 1.266 3.207.155.207 2.187 3.34 5.298 4.684.74.32 1.318.511 1.768.654.743.236 1.418.203 1.952.123.596-.089 1.835-.75 2.094-1.474.259-.724.259-1.345.181-1.474-.077-.129-.284-.207-.594-.362Z"
        />
      </svg>
    </a>
  );
}
