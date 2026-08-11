import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Terminal from './Terminal';

describe('Terminal', () => {
  it('shows the welcome line on mount', () => {
    render(<Terminal />);
    expect(screen.getByText(/Bienvenido a DS.SoftwareStudio/i)).toBeInTheDocument();
  });

  it('runs a known command from its button and shows the response', async () => {
    const user = userEvent.setup();
    render(<Terminal />);
    await user.click(screen.getByRole('button', { name: 'stack' }));
    expect(screen.getByText(/Tecnologías: Python, Django/i)).toBeInTheDocument();
  });

  it('shows the fallback message for an unknown command typed in the input', async () => {
    const user = userEvent.setup();
    render(<Terminal />);
    const input = screen.getByLabelText('Comando de terminal');
    await user.type(input, 'asdasd{enter}');
    expect(screen.getByText(/Comando no reconocido/i)).toBeInTheDocument();
  });

  it('clear wipes the history, including the welcome line', async () => {
    const user = userEvent.setup();
    render(<Terminal />);
    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(screen.queryByText(/Bienvenido a DS.SoftwareStudio/i)).not.toBeInTheDocument();
  });
});
