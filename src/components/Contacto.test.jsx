import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from './Contacto';

async function fillRequiredFields(user) {
  // Sequential on purpose: user-event dispatches real focus/keydown events per
  // keystroke, so running these concurrently via Promise.all races the focus
  // state and interleaves characters across fields.
  await user.type(screen.getByLabelText('Nombre o Empresa'), 'Juan Pérez');
  await user.selectOptions(screen.getByLabelText('Tipo de proyecto'), 'mvp');
  await user.type(screen.getByLabelText('¿Qué problema querés resolver?'), 'Necesito un MVP');
}

describe('Contacto', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('submits successfully and shows the confirmation message', async () => {
    const user = userEvent.setup();
    render(<Contacto />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /Enviar Consulta Directa/i }));
    expect(await screen.findByRole('status')).toHaveTextContent(/Gracias por comunicarte/i);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('shows an error message and a fallback email if the request fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const user = userEvent.setup();
    render(<Contacto />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /Enviar Consulta Directa/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/No pudimos enviar tu consulta/i);
  });

  it('silently skips the real request when the honeypot field is filled', async () => {
    const user = userEvent.setup();
    render(<Contacto />);
    await fillRequiredFields(user);
    await user.type(screen.getByLabelText('No completar este campo'), 'soy un bot');
    await user.click(screen.getByRole('button', { name: /Enviar Consulta Directa/i }));
    expect(await screen.findByRole('status')).toHaveTextContent(/Gracias por comunicarte/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
