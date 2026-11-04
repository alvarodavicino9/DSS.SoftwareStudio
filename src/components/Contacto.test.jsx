import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from './Contacto';

async function fillRequiredFields(user, { email = 'juan@example.com' } = {}) {
  // Secuencial a propósito: user-event dispara foco/teclas reales por cada
  // carácter, así que en paralelo (Promise.all) se mezclan entre campos.
  await user.type(screen.getByLabelText(/^Nombre/), 'Juan Pérez');
  if (email) await user.type(screen.getByLabelText(/^Email/), email);
  // "¿Qué necesitás?" son radios con estilo de chip.
  await user.click(screen.getByRole('radio', { name: 'Tienda online o catálogo' }));
  await user.type(screen.getByLabelText(/^Contanos tu proyecto/), 'Necesito una tienda online con panel para cargar productos');
}

const submit = (user) => user.click(screen.getByRole('button', { name: /Enviar consulta/i }));

describe('Contacto', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('envía la consulta y muestra la confirmación', async () => {
    const user = userEvent.setup();
    render(<Contacto />);
    await fillRequiredFields(user);
    await submit(user);
    expect(await screen.findByRole('status')).toHaveTextContent(/Gracias por comunicarte, Juan/i);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body).toMatchObject({
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      _replyto: 'juan@example.com',
      tipo_de_proyecto: 'Tienda online o catálogo',
    });
  });

  it('acepta solo WhatsApp, sin email', async () => {
    const user = userEvent.setup();
    render(<Contacto />);
    await fillRequiredFields(user, { email: '' });
    await user.type(screen.getByLabelText(/^WhatsApp o teléfono/), '351 123 4567');
    await submit(user);
    expect(await screen.findByRole('status')).toHaveTextContent(/al 351 123 4567/);
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body.email).toBeUndefined();
    expect(body.whatsapp_o_telefono).toBe('351 123 4567');
  });

  it('no envía si faltan datos y marca los errores', async () => {
    const user = userEvent.setup();
    render(<Contacto />);
    await submit(user);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByText('Contanos tu nombre.')).toBeInTheDocument();
    expect(screen.getByText(/Dejanos un email o un WhatsApp/)).toBeInTheDocument();
    expect(screen.getByText(/Elegí la opción/)).toBeInTheDocument();
    // El foco va al primer campo con error.
    expect(screen.getByLabelText(/^Nombre/)).toHaveFocus();
  });

  it('muestra un error con canales alternativos si falla el envío', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const user = userEvent.setup();
    render(<Contacto />);
    await fillRequiredFields(user);
    await submit(user);
    expect(await screen.findByText(/No pudimos enviar tu consulta/i)).toBeInTheDocument();
    // Los datos no se pierden.
    expect(screen.getByLabelText(/^Nombre/)).toHaveValue('Juan Pérez');
  });

  it('saltea el envío real si el honeypot está completo', async () => {
    const user = userEvent.setup();
    render(<Contacto />);
    await fillRequiredFields(user);
    await user.type(screen.getByLabelText('No completar este campo'), 'soy un bot');
    await submit(user);
    expect(await screen.findByRole('status')).toHaveTextContent(/Gracias por comunicarte/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
