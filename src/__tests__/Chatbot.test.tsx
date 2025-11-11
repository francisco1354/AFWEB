import { render, screen, fireEvent, within } from '@testing-library/react';
import Chatbot from '../components/Chatbot';
import { describe, it, expect } from 'vitest';

if (typeof globalThis.localStorage === 'undefined') {
  let store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  } as any;
}

describe('Chatbot component', () => {
  it('muestra mensaje inicial y responde a presets', async () => {
    render(<Chatbot />);
    const openBtn = screen.getByRole('button', { name: /Abrir ayuda rápida|Cerrar chat/i });
    fireEvent.click(openBtn);
    // seleccionar el botón de preset (no la burbuja de texto)
    const presetBtn = screen.getByRole('button', { name: /¿Cómo puedo subir una foto\?/i });
    fireEvent.click(presetBtn);
    // esperamos que aparezca respuesta bot (retardo en componente)
    // buscar dentro del body del chatbot para evitar matches en los botones de preset
  const modal = await screen.findByRole('dialog', { name: /Asistente Asfalto/i });
  // la respuesta del bot contiene "Para subir una foto pulsa el botón..." —
  // buscamos una porción única para evitar matches múltiples
  const reply = await within(modal).findByText(/pulsa el botón/i);
    expect(reply).toBeTruthy();
  });
});
