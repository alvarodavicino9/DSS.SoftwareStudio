import { useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { trackEvent } from '../utils/analytics';
import SpotlightButton from './SpotlightButton';
import Select from './Select';

// Endpoint real de Formspree — las consultas del formulario llegan a la
// cuenta de Formspree conectada a este form ID (ver README, sección
// "Pendientes para producción" / v11).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpzyvgr';

const PROJECT_TYPES = [
  { value: 'sistema', label: 'Sistema a medida / Backend' },
  { value: 'web', label: 'Plataforma Web / PWA' },
  { value: 'mvp', label: 'Desarrollo de MVP' },
  { value: 'otro', label: 'Otro / Consultoría' },
];

// Heurística liviana: no intenta validar el formato perfecto de un email o
// teléfono (eso rechaza casos válidos que no anticipamos), solo se fija que
// tenga cara de uno de los dos — un @ con algo después, o suficientes dígitos.
function looksLikeContact(value) {
  const v = value.trim();
  if (!v) return false;
  if (v.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const digits = v.replace(/\D/g, '');
  return digits.length >= 6;
}

function validate(form) {
  return {
    nombre: form.nombre.trim() ? '' : 'Contanos tu nombre o el de tu empresa.',
    tipo: form.tipo ? '' : 'Elegí una opción.',
    contactoInfo: looksLikeContact(form.contactoInfo) ? '' : 'Dejanos un email o teléfono para responderte.',
    mensaje: form.mensaje.trim() ? '' : 'Contanos brevemente tu idea.',
  };
}

export default function Contacto() {
  const [ref, visible] = useReveal();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [form, setForm] = useState({ nombre: '', tipo: '', contactoInfo: '', mensaje: '', empresa2: '' });
  const [touched, setTouched] = useState({});

  const errors = validate(form);

  function updateField(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function markTouched(key) {
    return () => setTouched((t) => ({ ...t, [key]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot: a field real users never see or fill. Bots that auto-fill every
    // input trip it — we just fake success and skip the actual request instead
    // of tipping them off that they were caught.
    if (form.empresa2) {
      setStatus('success');
      setForm({ nombre: '', tipo: '', contactoInfo: '', mensaje: '', empresa2: '' });
      return;
    }

    setTouched({ nombre: true, tipo: true, contactoInfo: true, mensaje: true });
    if (Object.values(errors).some(Boolean)) return;

    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_o_empresa: form.nombre,
          tipo_de_proyecto: form.tipo,
          email_o_telefono: form.contactoInfo,
          mensaje: form.mensaje,
        }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      setForm({ nombre: '', tipo: '', contactoInfo: '', mensaje: '', empresa2: '' });
      setTouched({});
      trackEvent('form_submit_success', { form: 'contacto' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contacto" className="section-textured section-alt" style={{ padding: '60px 40px 160px' }}>
      <div ref={ref} style={{ maxWidth: 700, margin: '0 auto', perspective: 1200, ...revealStyle(visible, 0) }}>
        <div className="section-header" style={{ marginBottom: 36 }}>
          <div className="section-kicker" />
          <h2 style={{ fontSize: 32, margin: '0 0 10px', letterSpacing: '-0.015em' }}>Iniciemos tu proyecto</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>
            Completá los datos y te respondemos en menos de 24 horas.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--border-neutral)',
            borderRadius: 14,
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Honeypot — invisible to real users, tabIndex -1 keeps keyboard nav clean */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="empresa2">No completar este campo</label>
            <input
              id="empresa2"
              name="empresa2"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.empresa2}
              onChange={updateField('empresa2')}
            />
          </div>

          <div className="field">
            <label htmlFor="nombre">Nombre o Empresa</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ej: Juan Pérez"
              className={`input${touched.nombre && errors.nombre ? ' input-error' : ''}`}
              value={form.nombre}
              onChange={updateField('nombre')}
              onBlur={markTouched('nombre')}
              disabled={status === 'sending'}
              aria-invalid={touched.nombre && !!errors.nombre}
            />
            {touched.nombre && errors.nombre && <p className="field-error">{errors.nombre}</p>}
          </div>

          <div className="field">
            <label htmlFor="tipo">Tipo de proyecto</label>
            <Select
              id="tipo"
              options={PROJECT_TYPES}
              value={form.tipo}
              onChange={(v) => setForm((f) => ({ ...f, tipo: v }))}
              onBlur={markTouched('tipo')}
              disabled={status === 'sending'}
              className={touched.tipo && errors.tipo ? 'input-error' : ''}
            />
            {touched.tipo && errors.tipo && <p className="field-error">{errors.tipo}</p>}
          </div>

          <div className="field">
            <label htmlFor="contactoInfo">Email o Teléfono</label>
            <input
              id="contactoInfo"
              type="text"
              placeholder="tu@email.com o +54 9 11 1234-5678"
              className={`input${touched.contactoInfo && errors.contactoInfo ? ' input-error' : ''}`}
              value={form.contactoInfo}
              onChange={updateField('contactoInfo')}
              onBlur={markTouched('contactoInfo')}
              disabled={status === 'sending'}
              aria-invalid={touched.contactoInfo && !!errors.contactoInfo}
            />
            {touched.contactoInfo && errors.contactoInfo && <p className="field-error">{errors.contactoInfo}</p>}
          </div>

          <div className="field">
            <label htmlFor="mensaje">¿Qué problema querés resolver?</label>
            <textarea
              id="mensaje"
              rows={4}
              placeholder="Contanos brevemente sobre tu idea o necesidad..."
              className={`input${touched.mensaje && errors.mensaje ? ' input-error' : ''}`}
              value={form.mensaje}
              onChange={updateField('mensaje')}
              onBlur={markTouched('mensaje')}
              disabled={status === 'sending'}
              aria-invalid={touched.mensaje && !!errors.mensaje}
            />
            {touched.mensaje && errors.mensaje && <p className="field-error">{errors.mensaje}</p>}
          </div>

          <SpotlightButton as="button" type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando...' : 'Enviar Consulta Directa'}
          </SpotlightButton>

          {status === 'success' && (
            <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--color-accent-300)' }}>
              ¡Gracias por comunicarte con DS.SoftwareStudio! Te responderemos en menos de 24 hs.
            </p>
          )}
          {status === 'error' && (
            <p role="alert" style={{ margin: 0, fontSize: 13, color: '#ff8a80' }}>
              No pudimos enviar tu consulta. Escribinos directo a{' '}
              <a href="mailto:dss.softwarestudio@gmail.com" style={{ color: 'var(--color-accent-300)', textDecoration: 'underline' }}>
                dss.softwarestudio@gmail.com
              </a>{' '}
              mientras lo solucionamos.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
