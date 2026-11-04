import { useId, useRef, useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { trackEvent } from '../utils/analytics';
import { waLink } from '../utils/whatsapp';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../utils/instagram';
import SpotlightButton from './SpotlightButton';

// Endpoint real de Formspree — las consultas del formulario llegan a la
// cuenta de Formspree conectada a este form ID (ver README, sección
// "Pendientes para producción" / v11).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpzyvgr';
const EMAIL = 'dss.softwarestudio@gmail.com';
const MSG_MIN = 20;
const MSG_MAX = 1200;

// Opciones como chips (radios reales con estilo de chip): en el celular se
// eligen con un toque, sin abrir un desplegable, y quedan todas a la vista.
// Los tipos salen de los casos reales del portafolio (casos.js).
const TIPOS = [
  { value: 'sitio-web', label: 'Sitio web o landing' },
  { value: 'tienda-online', label: 'Tienda online o catálogo' },
  { value: 'sistema-admin', label: 'Sistema con panel de administración' },
  { value: 'reservas', label: 'Reservas o turnos online' },
  { value: 'app-pwa', label: 'App web / PWA' },
  { value: 'automatizacion', label: 'Automatización o bot' },
  { value: 'otro', label: 'Otro' },
];

const PUNTO_DE_PARTIDA = [
  { value: 'desde-cero', label: 'Empiezo de cero' },
  { value: 'mejorar', label: 'Quiero mejorar algo que ya tengo' },
];

const PLAZOS = [
  { value: 'urgente', label: 'Lo antes posible' },
  { value: '1-2-meses', label: 'En 1 o 2 meses' },
  { value: 'sin-fecha', label: 'Sin fecha definida' },
];

const PASOS = [
  { title: 'Te respondemos', desc: 'Leemos tu consulta y te escribimos en menos de 24 hs hábiles.' },
  { title: 'Charlamos', desc: 'Una llamada breve para entender tu negocio y qué necesitás resolver.' },
  { title: 'Propuesta por escrito', desc: 'Alcance, tiempos y costo antes de arrancar. Sin compromiso.' },
];

const EMPTY = {
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  tipo: '',
  partida: '',
  plazo: '',
  mensaje: '',
  empresa2: '', // honeypot
};

const labelOf = (list, value) => list.find((o) => o.value === value)?.label || '';

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function isPhone(v) {
  return v.replace(/\D/g, '').length >= 8;
}

function validate(form) {
  const email = form.email.trim();
  const tel = form.telefono.trim();
  let email_err = '';
  let tel_err = '';
  if (!email && !tel) {
    email_err = 'Dejanos un email o un WhatsApp para responderte.';
  } else {
    if (email && !isEmail(email)) email_err = 'Revisá el email, parece incompleto.';
    if (tel && !isPhone(tel)) tel_err = 'Revisá el número: código de área + número.';
  }
  const msg = form.mensaje.trim();
  return {
    nombre: form.nombre.trim().length >= 2 ? '' : 'Contanos tu nombre.',
    email: email_err,
    telefono: tel_err,
    tipo: form.tipo ? '' : 'Elegí la opción que más se parezca.',
    mensaje: !msg
      ? 'Contanos brevemente qué necesitás.'
      : msg.length < MSG_MIN
        ? `Sumá un poco más de detalle (mínimo ${MSG_MIN} caracteres).`
        : '',
  };
}

// Orden de los campos para llevar el foco al primero con error al enviar.
const FIELD_ORDER = ['nombre', 'email', 'telefono', 'tipo', 'mensaje'];

function waSummary(form) {
  const lines = [`Hola DS.SoftwareStudio! Soy ${form.nombre.trim()}${form.empresa.trim() ? ` (${form.empresa.trim()})` : ''}.`];
  if (form.tipo) lines.push(`Busco: ${labelOf(TIPOS, form.tipo)}.`);
  if (form.mensaje.trim()) lines.push(form.mensaje.trim());
  return lines.join('\n');
}

function ChipGroup({ name, label, hint, options, value, onChange, error, disabled, required }) {
  const id = useId();
  return (
    <fieldset className="field contact-fieldset" aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}>
      <legend className="contact-legend">
        {label} {required ? <span className="contact-req" aria-hidden="true">*</span> : <span className="contact-optional">(opcional)</span>}
      </legend>
      {hint && <p id={`${id}-hint`} className="contact-hint">{hint}</p>}
      <div className="contact-chips" data-field={name}>
        {options.map((o) => (
          <label key={o.value} className={`contact-chip${value === o.value ? ' is-checked' : ''}`}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              disabled={disabled}
              required={required}
              aria-invalid={!!error}
              // Los opcionales se pueden destildar tocando otra vez el mismo chip.
              onClick={() => !required && value === o.value && onChange('')}
              onChange={() => onChange(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </fieldset>
  );
}

function Field({ id, label, required, optional = true, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}{' '}
        {required ? (
          <span className="contact-req" aria-hidden="true">*</span>
        ) : (
          optional && <span className="contact-optional">(opcional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="field-error" role="alert">{error}</p>
      ) : (
        hint && <p id={`${id}-hint`} className="contact-hint">{hint}</p>
      )}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsappIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 3C9.1 3 3.5 8.6 3.5 15.5c0 2.5.7 4.8 2 6.7L3.5 29l6.9-1.9a12.4 12.4 0 0 0 5.6 1.3c6.9 0 12.5-5.6 12.5-12.5S22.9 3 16 3Zm0 22.9c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.9 1 1-3.8-.2-.4a10.3 10.3 0 0 1-1.6-5.5C5.6 9.9 10.3 5.2 16 5.2s10.3 4.7 10.3 10.3S21.7 25.9 16 25.9Zm5.7-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.3 5.3 4.7.7.3 1.3.5 1.8.7.7.2 1.4.2 2 .1.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3Z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function ContactAside() {
  return (
    <aside className="contact-aside card" aria-label="Qué pasa después y otros canales">
      <span className="card-kicker">Qué pasa después</span>
      <ol className="contact-steps">
        {PASOS.map((p, i) => (
          <li key={p.title}>
            <span className="contact-step-n" aria-hidden="true">{i + 1}</span>
            <div>
              <strong>{p.title}</strong>
              <p>{p.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="contact-aside-divider" />

      <span className="card-kicker">¿Preferís hablar directo?</span>
      <div className="contact-channels">
        <a
          className="contact-channel contact-channel-wa"
          href={waLink('Hola DS.SoftwareStudio! Quiero consultar por un proyecto.')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { location: 'contacto_aside' })}
        >
          <WhatsappIcon />
          <span>
            <strong>WhatsApp</strong>
            <small>Respuesta más rápida</small>
          </span>
        </a>
        <a className="contact-channel" href={`mailto:${EMAIL}`} onClick={() => trackEvent('email_click', { location: 'contacto_aside' })}>
          <MailIcon />
          <span>
            <strong>Email</strong>
            <small>{EMAIL}</small>
          </span>
        </a>
        <a className="contact-channel" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          <InstagramIcon />
          <span>
            <strong>Instagram</strong>
            <small>@{INSTAGRAM_HANDLE}</small>
          </span>
        </a>
      </div>

      <ul className="contact-trust">
        <li>Sin compromiso</li>
        <li>Hablás con quienes programan</li>
        <li>Presupuesto por escrito</li>
      </ul>
    </aside>
  );
}

export default function Contacto() {
  const [ref, visible] = useReveal();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(null); // copia de lo enviado, para el mensaje de éxito
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const successRef = useRef(null);

  const errors = validate(form);
  const show = (key) => (submitted || touched[key]) && errors[key];
  const sending = status === 'sending';

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const onInput = (key) => (e) => set(key)(e.target.value);
  const onBlur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  function focusFirstError() {
    const first = FIELD_ORDER.find((k) => errors[k]);
    if (!first || !formRef.current) return;
    const el =
      first === 'tipo'
        ? formRef.current.querySelector('[data-field="tipo"] input')
        : formRef.current.querySelector(`#contacto-${first}`);
    el?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot: un campo que una persona nunca ve ni completa. Los bots que
    // llenan todo lo pisan — fingimos el éxito y no mandamos nada, para no
    // avisarles que los detectamos.
    if (form.empresa2) {
      setSent(form);
      setStatus('success');
      setForm(EMPTY);
      return;
    }

    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) {
      focusFirstError();
      return;
    }

    setStatus('sending');
    const tipo = labelOf(TIPOS, form.tipo);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `Nueva consulta web: ${tipo} — ${form.nombre.trim()}`,
          ...(form.email.trim() ? { email: form.email.trim(), _replyto: form.email.trim() } : {}),
          nombre: form.nombre.trim(),
          empresa: form.empresa.trim() || '—',
          whatsapp_o_telefono: form.telefono.trim() || '—',
          tipo_de_proyecto: tipo,
          punto_de_partida: labelOf(PUNTO_DE_PARTIDA, form.partida) || '—',
          plazo: labelOf(PLAZOS, form.plazo) || '—',
          mensaje: form.mensaje.trim(),
        }),
      });
      if (!res.ok) throw new Error('request failed');
      setSent(form);
      setStatus('success');
      setForm(EMPTY);
      setTouched({});
      setSubmitted(false);
      trackEvent('form_submit_success', { form: 'contacto', tipo: form.tipo });
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus('error');
      trackEvent('form_submit_error', { form: 'contacto' });
    }
  }

  function reset() {
    setStatus('idle');
    setSent(null);
  }

  const msgLen = form.mensaje.length;

  return (
    <section id="contacto" className="section-textured section-alt section-pad">
      <div ref={ref} style={{ maxWidth: 1200, margin: '0 auto', ...revealStyle(visible, 0, 'marcada') }}>
        <div className="section-header" style={{ marginBottom: 40, maxWidth: 620 }}>
          <div className="section-kicker" />
          <h2 className="section-title">Contanos tu proyecto</h2>
          <p className="section-sub">
            Completá el formulario y te respondemos en menos de 24 horas hábiles con los próximos pasos. Sin compromiso.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-main card">
            {status === 'success' && sent ? (
              <div ref={successRef} tabIndex={-1} className="contact-success" role="status">
                <span className="contact-success-icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3>¡Gracias por comunicarte{sent.nombre.trim() ? `, ${sent.nombre.trim().split(' ')[0]}` : ''}!</h3>
                <p>
                  Recibimos tu consulta y te respondemos en menos de 24 hs hábiles
                  {sent.email.trim() ? ` a ${sent.email.trim()}` : sent.telefono.trim() ? ` al ${sent.telefono.trim()}` : ''}.
                </p>
                <div className="contact-success-actions">
                  <a
                    className="btn btn-secondary"
                    href={waLink(waSummary(sent))}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { location: 'contacto_success' })}
                  >
                    <WhatsappIcon /> Seguir por WhatsApp
                  </a>
                  <button type="button" className="btn btn-ghost" onClick={reset}>
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="contact-form" aria-describedby="contacto-req-note">
                {/* Honeypot — invisible para personas; tabIndex -1 para no entrar con Tab */}
                <div aria-hidden="true" className="contact-hp">
                  <label htmlFor="empresa2">No completar este campo</label>
                  <input id="empresa2" name="empresa2" type="text" tabIndex={-1} autoComplete="off" value={form.empresa2} onChange={onInput('empresa2')} />
                </div>

                <div className="contact-row">
                  <Field id="contacto-nombre" label="Nombre" required error={show('nombre')}>
                    <input
                      id="contacto-nombre"
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      placeholder="Ej.: Juan Pérez"
                      className={`input${show('nombre') ? ' input-error' : ''}`}
                      value={form.nombre}
                      onChange={onInput('nombre')}
                      onBlur={onBlur('nombre')}
                      disabled={sending}
                      aria-invalid={!!show('nombre')}
                      aria-describedby={show('nombre') ? 'contacto-nombre-err' : undefined}
                    />
                  </Field>
                  <Field id="contacto-empresa" label="Empresa o emprendimiento">
                    <input
                      id="contacto-empresa"
                      name="empresa"
                      type="text"
                      autoComplete="organization"
                      placeholder="Ej.: Hamburguesería Fuegos"
                      className="input"
                      value={form.empresa}
                      onChange={onInput('empresa')}
                      disabled={sending}
                    />
                  </Field>
                </div>

                <div className="contact-row">
                  <Field id="contacto-email" label="Email" optional={false} error={show('email')} hint="Con uno de los dos (email o WhatsApp) alcanza.">
                    <input
                      id="contacto-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder="tu@email.com"
                      className={`input${show('email') ? ' input-error' : ''}`}
                      value={form.email}
                      onChange={onInput('email')}
                      onBlur={onBlur('email')}
                      disabled={sending}
                      aria-invalid={!!show('email')}
                      aria-describedby={show('email') ? 'contacto-email-err' : 'contacto-email-hint'}
                    />
                  </Field>
                  <Field id="contacto-telefono" label="WhatsApp o teléfono" optional={false} error={show('telefono')}>
                    <input
                      id="contacto-telefono"
                      name="telefono"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Ej.: 351 123 4567"
                      className={`input${show('telefono') ? ' input-error' : ''}`}
                      value={form.telefono}
                      onChange={onInput('telefono')}
                      onBlur={onBlur('telefono')}
                      disabled={sending}
                      aria-invalid={!!show('telefono')}
                      aria-describedby={show('telefono') ? 'contacto-telefono-err' : undefined}
                    />
                  </Field>
                </div>

                <ChipGroup
                  name="tipo"
                  label="¿Qué necesitás?"
                  options={TIPOS}
                  value={form.tipo}
                  onChange={set('tipo')}
                  error={show('tipo')}
                  disabled={sending}
                  required
                />

                <div className="contact-row">
                  <ChipGroup name="partida" label="Punto de partida" options={PUNTO_DE_PARTIDA} value={form.partida} onChange={set('partida')} disabled={sending} />
                  <ChipGroup name="plazo" label="¿Para cuándo?" options={PLAZOS} value={form.plazo} onChange={set('plazo')} disabled={sending} />
                </div>

                <Field id="contacto-mensaje" label="Contanos tu proyecto" required error={show('mensaje')}>
                  <textarea
                    id="contacto-mensaje"
                    name="mensaje"
                    rows={5}
                    maxLength={MSG_MAX}
                    placeholder="Ej.: Tenemos una hamburguesería y queremos que los clientes armen el pedido en la web y nos llegue por WhatsApp, con un panel para cambiar precios."
                    className={`input${show('mensaje') ? ' input-error' : ''}`}
                    value={form.mensaje}
                    onChange={onInput('mensaje')}
                    onBlur={onBlur('mensaje')}
                    disabled={sending}
                    aria-invalid={!!show('mensaje')}
                    aria-describedby={`contacto-mensaje-count${show('mensaje') ? ' contacto-mensaje-err' : ''}`}
                  />
                  <span id="contacto-mensaje-count" className="contact-count" aria-live="off">
                    {msgLen}/{MSG_MAX}
                  </span>
                </Field>

                {status === 'error' && (
                  <div role="alert" className="contact-alert">
                    <strong>No pudimos enviar tu consulta.</strong> Probá de nuevo en un momento, o escribinos directo por{' '}
                    <a href={waLink(waSummary(form))} target="_blank" rel="noopener noreferrer">WhatsApp</a> o a{' '}
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Tus datos siguen cargados.
                  </div>
                )}

                <div className="contact-submit-row">
                  <SpotlightButton as="button" type="submit" className="btn btn-primary contact-submit" disabled={sending} aria-busy={sending}>
                    {sending ? (
                      <>
                        <span className="contact-spinner" aria-hidden="true" /> Enviando…
                      </>
                    ) : (
                      <>
                        Enviar consulta <ArrowIcon />
                      </>
                    )}
                  </SpotlightButton>
                  <p id="contacto-req-note" className="contact-fineprint">
                    <span className="contact-req" aria-hidden="true">*</span> Obligatorio, más un email o un WhatsApp. Usamos tus datos solo para responder tu consulta.
                  </p>
                </div>
              </form>
            )}
          </div>

          <ContactAside />
        </div>

      </div>
    </section>
  );
}
