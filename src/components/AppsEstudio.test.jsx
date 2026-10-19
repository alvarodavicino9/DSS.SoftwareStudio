import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppsEstudio from './AppsEstudio';
import { ANOTADOR_URL } from '../data/apps';

describe('AppsEstudio', () => {
  it('renders the featured Anotador de Truco card with its chips, without the hidden "Próxima app" slots', () => {
    render(<AppsEstudio />);
    expect(screen.getByRole('heading', { name: 'Apps del Estudio' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Anotador de Truco' })).toBeInTheDocument();
    expect(screen.getByText('Sin cuenta')).toBeInTheDocument();
    expect(screen.getByAltText(/Anotador de Truco/i)).toHaveAttribute('loading', 'lazy');
    expect(screen.queryByText('Próxima app')).not.toBeInTheDocument();
  });

  it('lists what the app includes (tournaments, history, signs) and its stack', () => {
    render(<AppsEstudio />);
    expect(screen.getByText('Qué incluye')).toBeInTheDocument();
    expect(screen.getByText(/Modo torneo de 4 u 8 equipos/)).toBeInTheDocument();
    expect(screen.getByText(/Historial con todas las manos/)).toBeInTheDocument();
    expect(screen.getByText(/Diccionario de señas/)).toBeInTheDocument();
    expect(screen.getByText('Tecnología')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
  });

  it('opens the anotador in a new tab, safely', () => {
    render(<AppsEstudio />);
    const button = screen.getByRole('link', { name: /Abrir el anotador/i });
    expect(button).toHaveAttribute('href', ANOTADOR_URL);
    expect(button).toHaveAttribute('target', '_blank');
    expect(button).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
