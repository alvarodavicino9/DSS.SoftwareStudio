import { useEffect, useRef, useState } from 'react';
import { WHATSAPP_URL, waLink } from '../utils/whatsapp';
import { trackEvent } from '../utils/analytics';

const QUICK_OPTIONS = [
  { label: 'Quiero un presupuesto para mi proyecto', message: 'Hola, quiero un presupuesto para mi proyecto.' },
  { label: 'Tengo una consulta técnica', message: 'Hola, tengo una consulta técnica.' },
  { label: 'Quiero agendar una consulta', message: 'Hola, quiero agendar una consulta.' },
];

function WhatsappIcon({ size = 26 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.004 3C9.096 3 3.5 8.596 3.5 15.504c0 2.474.72 4.78 1.964 6.72L3.5 29l6.94-1.912a12.42 12.42 0 0 0 5.564 1.318h.005c6.907 0 12.503-5.596 12.503-12.503C28.512 8.596 22.916 3.005 16.004 3Zm0 22.87a10.33 10.33 0 0 1-5.264-1.442l-.378-.224-3.918 1.08 1.05-3.82-.246-.393a10.31 10.31 0 0 1-1.582-5.5c0-5.702 4.638-10.34 10.343-10.34 5.702 0 10.34 4.638 10.34 10.34 0 5.703-4.638 10.3-10.345 10.3Zm5.67-7.735c-.31-.155-1.835-.906-2.12-1.01-.284-.104-.492-.155-.7.155-.207.31-.803 1.01-.985 1.218-.181.207-.362.233-.673.078-.31-.155-1.309-.483-2.494-1.54-.922-.822-1.545-1.837-1.726-2.147-.181-.31-.02-.478.136-.632.14-.14.31-.362.465-.543.156-.181.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.155-.7-1.687-.96-2.31-.253-.605-.51-.524-.7-.533l-.596-.01c-.207 0-.543.078-.828.388-.284.31-1.085 1.06-1.085 2.585 0 1.526 1.11 3 1.266 3.207.155.207 2.187 3.34 5.298 4.684.74.32 1.318.511 1.768.654.743.236 1.418.203 1.952.123.596-.089 1.835-.75 2.094-1.474.259-.724.259-1.345.181-1.474-.077-.129-.284-.207-.594-.362Z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/**
 * Persistent floating WhatsApp button — visible from the moment the page
 * loads. Clicking it opens a small chat-style widget (brand header, greeting,
 * quick-reply options and a catch-all "Abrir WhatsApp" button) instead of
 * jumping straight to WhatsApp, so visitors land on a pre-written message.
 */
export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  function toggle() {
    setOpen((wasOpen) => {
      if (!wasOpen) trackEvent('whatsapp_widget_open', { location: 'floating_button' });
      return !wasOpen;
    });
  }

  function openChat(message, optionLabel) {
    trackEvent('whatsapp_click', { location: 'floating_widget', option: optionLabel || 'abrir_whatsapp' });
    window.open(message ? waLink(message) : WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    setOpen(false);
  }

  return (
    <div className="whatsapp-widget">
      {open && (
        <div ref={panelRef} role="dialog" aria-label="Chat de WhatsApp con DS.SoftwareStudio" className="whatsapp-panel">
          <div className="whatsapp-panel-header">
            <div>
              <strong>DS.SoftwareStudio</strong>
              <div className="whatsapp-status">
                <span className="whatsapp-status-dot" aria-hidden="true" />
                Disponible ahora
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat" className="whatsapp-panel-close">
              <CloseIcon />
            </button>
          </div>

          <div className="whatsapp-panel-body">
            <p>¡Hola! 👋 ¿En qué podemos ayudarte? Elegí una opción o escribinos directo.</p>
            <div className="whatsapp-options">
              {QUICK_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className="whatsapp-option-btn"
                  onClick={() => openChat(opt.message, opt.label)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="whatsapp-panel-footer" onClick={() => openChat(null)}>
            <WhatsappIcon size={18} />
            Abrir WhatsApp
          </button>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        onClick={toggle}
        aria-label={open ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp'}
        aria-expanded={open}
        className="floating-whatsapp"
      >
        {!open && <span className="floating-whatsapp-ring" aria-hidden="true" />}
        {open ? <CloseIcon /> : <WhatsappIcon size={28} />}
      </button>
    </div>
  );
}
