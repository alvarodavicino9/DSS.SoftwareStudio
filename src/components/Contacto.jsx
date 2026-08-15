import { useState } from 'react';
import { useReveal, revealStyle } from '../hooks/useReveal';
import { trackEvent } from '../utils/analytics';
import SpotlightButton from './SpotlightButton';

// TODO(cliente): reemplazar por el endpoint real de Formspree.
// 1. Crear cuenta gratis en https://formspree.io con el email que reciba las consultas.
// 2. Crear un formulario nuevo — Formspree te da una URL tipo https://formspree.io/f/xxxxxxx
// 3. Pegar esa URL acá abajo. Hasta entonces el formulario queda funcional pero sin
//    destinatario real (Formspree devuelve error y se lo mostramos al usuario).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const PROJECT_TYPES = [
  { value: '', label: 'Seleccionar opción...' },
  { value: 'sistema', label: 'Sistema a medida / Backend' },
  { value: 'web', label: 'Plataforma Web / PWA' },
  { value: 'mvp', label: 'Desarrollo de MVP' },
  { value: 'otro', label: 'Otro / Consultoría' },
];

export default function Contacto() {
  const [ref, visible] = useReveal();
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [form, setForm] = useState({ nombre: '', tipo: '', mensaje: '', empresa2: '' });

  function updateField(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot: a field real users never see or fill. Bots that auto-fill every
    // input trip it — we just fake success and skip the actual request instead
    // of tipping them off that they were caught.
    if (form.empresa2) {
      setStatus('success');
      setForm({ nombre: '', tipo: '', mensaje: '', empresa2: '' });
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_o_empresa: form.nombre,
          tipo_de_proyecto: form.tipo,
          mensaje: form.mensaje,
        }),
      });
      if (!res.ok) throw new Error('request failed');
      setStatus('success');
      setForm({ nombre: '', tipo: '', mensaje: '', empresa2: '' });
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
              required
              className="input"
              value={form.nombre}
              onChange={updateField('nombre')}
              disabled={status === 'sending'}
            />
          </div>

          <div className="field">
            <label htmlFor="tipo">Tipo de proyecto</label>
            <select
              id="tipo"
              required
              className="input"
              value={form.tipo}
              onChange={updateField('tipo')}
              disabled={status === 'sending'}
            >
              {PROJECT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="mensaje">¿Qué problema querés resolver?</label>
            <textarea
              id="mensaje"
              rows={4}
              placeholder="Contanos brevemente sobre tu idea o necesidad..."
              required
              className="input"
              value={form.mensaje}
              onChange={updateField('mensaje')}
              disabled={status === 'sending'}
            />
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
              <a href="mailto:contacto@dssoftwarestudio.com.ar" style={{ color: 'var(--color-accent-300)', textDecoration: 'underline' }}>
                contacto@dssoftwarestudio.com.ar
              </a>{' '}
              mientras lo solucionamos.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
