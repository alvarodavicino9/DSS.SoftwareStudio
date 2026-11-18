import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_URL, waLink } from '../utils/whatsapp';
import { trackEvent } from '../utils/analytics';

/* ── Botón flotante de WhatsApp ───────────────────────────────────────
 * v23: mismo funcionamiento que el de Boom Zapas, con la marca de DSS.
 *  - Botón con degradé de marca y punto verde de "en línea"; a los pocos
 *    segundos aparece un globito de invitación (una sola vez).
 *  - Al tocarlo se abre un chat: preguntas rápidas que se pueden marcar
 *    (una o varias), y opcionalmente el nombre y un mensaje. "Enviar
 *    consulta" abre WhatsApp con todo el mensaje ya armado.
 *  - Computadora: panel flotante arriba del botón.
 *  - Celular (< 640 px): el panel sube desde abajo a lo ancho de la
 *    pantalla, con el fondo oscurecido y la página bloqueada atrás; se
 *    cierra deslizándolo hacia abajo, tocando afuera o con la X.
 * ─────────────────────────────────────────────────────────────────── */

const PREGUNTAS = [
  'Quiero un presupuesto para mi proyecto',
  'Necesito una página web o tienda online',
  'Quiero un sistema con panel de administración',
  'Quiero mejorar una web que ya tengo',
  '¿Cuánto tarda un proyecto?',
  'Tengo una consulta técnica',
];

function WhatsappIcon({ size = 26 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.004 3C9.096 3 3.5 8.596 3.5 15.504c0 2.474.72 4.78 1.964 6.72L3.5 29l6.94-1.912a12.42 12.42 0 0 0 5.564 1.318h.005c6.907 0 12.503-5.596 12.503-12.503C28.512 8.596 22.916 3.005 16.004 3Zm0 22.87a10.33 10.33 0 0 1-5.264-1.442l-.378-.224-3.918 1.08 1.05-3.82-.246-.393a10.31 10.31 0 0 1-1.582-5.5c0-5.702 4.638-10.34 10.343-10.34 5.702 0 10.34 4.638 10.34 10.34 0 5.703-4.638 10.3-10.345 10.3Zm5.67-7.735c-.31-.155-1.835-.906-2.12-1.01-.284-.104-.492-.155-.7.155-.207.31-.803 1.01-.985 1.218-.181.207-.362.233-.673.078-.31-.155-1.309-.483-2.494-1.54-.922-.822-1.545-1.837-1.726-2.147-.181-.31-.02-.478.136-.632.14-.14.31-.362.465-.543.156-.181.207-.31.31-.517.104-.207.052-.388-.026-.543-.078-.155-.7-1.687-.96-2.31-.253-.605-.51-.524-.7-.533l-.596-.01c-.207 0-.543.078-.828.388-.284.31-1.085 1.06-1.085 2.585 0 1.526 1.11 3 1.266 3.207.155.207 2.187 3.34 5.298 4.684.74.32 1.318.511 1.768.654.743.236 1.418.203 1.952.123.596-.089 1.835-.75 2.094-1.474.259-.724.259-1.345.181-1.474-.077-.129-.284-.207-.594-.362Z"
      />
    </svg>
  );
}

function XIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function PlusIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'none' }}>
      <path stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

const MOBILE_QUERY = '(max-width: 639px)';

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [elegidas, setElegidas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [extra, setExtra] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const id = useId();

  const [esCel, setEsCel] = useState(() => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches);
  useEffect(() => {
    const m = window.matchMedia(MOBILE_QUERY);
    const f = () => setEsCel(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);

  // Celular: con el panel abierto, la página de atrás no scrollea.
  useEffect(() => {
    if (!(open && esCel)) return undefined;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open, esCel]);

  // Invitación suave a los pocos segundos (se va sola).
  useEffect(() => {
    const t = window.setTimeout(() => setNudge(true), 6000);
    const h = window.setTimeout(() => setNudge(false), 13000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(h);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    setNudge(false);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onDown = (e) => {
      if (!panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  const toggle = (q) => setElegidas((l) => (l.includes(q) ? l.filter((x) => x !== q) : [...l, q]));

  const abrirPanel = () => {
    setOpen((o) => {
      if (!o) trackEvent('whatsapp_widget_open', { location: 'floating_button' });
      return !o;
    });
  };

  const cerrar = () => {
    setOpen(false);
    btnRef.current?.focus();
  };

  const enviar = () => {
    const hayAlgo = elegidas.length > 0 || mensaje.trim();
    const lineas = [
      `¡Hola DS.SoftwareStudio! 👋${nombre.trim() ? ` Soy ${nombre.trim()}.` : ''}`,
      '',
      elegidas.length ? '*Quería consultarles:*' : null,
      ...elegidas.map((q) => `• ${q}`),
      elegidas.length && mensaje.trim() ? '' : null,
      mensaje.trim() ? `💬 ${mensaje.trim()}` : null,
    ].filter((l) => l !== null);
    window.open(hayAlgo ? waLink(lineas.join('\n')) : WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    trackEvent('whatsapp_click', { location: 'floating_widget', opciones: elegidas.length, con_mensaje: !!mensaje.trim() });
    setOpen(false);
    setElegidas([]);
    setMensaje('');
    setExtra(false);
  };

  const cabecera = (
    <div className="waw-head">
      <span className="waw-avatar" aria-hidden="true">
        <span>&lt;/&gt;</span>
        <i className="waw-online" />
      </span>
      <div className="waw-head-text">
        <p className="waw-name">DS.SoftwareStudio</p>
        <p className="waw-status">En línea · respondemos en el día</p>
      </div>
      <button type="button" onClick={cerrar} aria-label="Cerrar" className="waw-close">
        <XIcon size={18} />
      </button>
    </div>
  );

  const cuerpo = (
    <div className="waw-body">
      <p className="waw-bubble">¡Hola! 👋 ¿En qué te ayudamos? Elegí una o más opciones y te respondemos por WhatsApp.</p>

      <ul className="waw-options" aria-label="Preguntas rápidas">
        {PREGUNTAS.map((q) => {
          const on = elegidas.includes(q);
          return (
            <li key={q}>
              <button type="button" aria-pressed={on} onClick={() => toggle(q)} className={`waw-option${on ? ' is-on' : ''}`}>
                <span className="waw-check">{on && <CheckIcon />}</span>
                {q}
              </button>
            </li>
          );
        })}
      </ul>

      <button type="button" onClick={() => setExtra((v) => !v)} aria-expanded={extra} className="waw-extra-toggle">
        <PlusIcon open={extra} />
        {extra ? 'Ocultar mensaje' : 'Escribir un mensaje o dejar mi nombre'}
      </button>
      {extra && (
        <div className="waw-extra">
          <label>
            <span>Tu nombre (opcional)</span>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} autoComplete="given-name" />
          </label>
          <label>
            <span>Tu mensaje (opcional)</span>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value.slice(0, 400))}
              rows={2}
              placeholder="Contanos brevemente tu idea…"
            />
          </label>
        </div>
      )}
    </div>
  );

  const pie = (
    <div className="waw-foot">
      <button type="button" onClick={enviar} className="waw-send">
        <WhatsappIcon size={20} />
        {elegidas.length ? `Enviar consulta (${elegidas.length})` : 'Abrir WhatsApp'}
      </button>
      <p>Se abre WhatsApp con tu mensaje listo para mandar.</p>
    </div>
  );

  return (
    <>
      {/* Celular: panel que sube desde abajo, con el fondo oscurecido */}
      {esCel &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div className="waw-sheet-layer" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
                <motion.div
                  className="waw-backdrop"
                  onClick={() => setOpen(false)}
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <motion.div
                  ref={panelRef}
                  id={id}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Escribinos por WhatsApp"
                  className="waw-panel waw-sheet"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 38 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.7 }}
                  onDragEnd={(_, info) => (info.offset.y > 90 || info.velocity.y > 500) && setOpen(false)}
                >
                  <span aria-hidden="true" className="waw-grabber" />
                  {cabecera}
                  {cuerpo}
                  {pie}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      <div className="waw-dock">
        {/* Computadora: panel flotante arriba del botón */}
        <AnimatePresence>
          {open && !esCel && (
            <motion.div
              ref={panelRef}
              id={id}
              role="dialog"
              aria-label="Escribinos por WhatsApp"
              className="waw-panel waw-float"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {cabecera}
              {cuerpo}
              {pie}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`waw-btn-row${open && esCel ? ' is-hidden' : ''}`}>
          <AnimatePresence>
            {nudge && !open && (
              <motion.button
                type="button"
                className="waw-nudge"
                onClick={abrirPanel}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
              >
                ¿Tenés un proyecto en mente?
                <small>Respondemos en el día</small>
              </motion.button>
            )}
          </AnimatePresence>
          <button
            ref={btnRef}
            type="button"
            onClick={abrirPanel}
            aria-expanded={open}
            aria-controls={id}
            aria-label={open ? 'Cerrar chat de WhatsApp' : 'Escribinos por WhatsApp'}
            className="waw-btn"
          >
            {open ? <XIcon size={24} /> : <WhatsappIcon size={28} />}
            {!open && <span aria-hidden="true" className="waw-btn-dot" />}
          </button>
        </div>
      </div>
    </>
  );
}
