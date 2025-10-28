import { describe, it, expect } from 'vitest';
import { cannedReply } from '../utils/chat';

describe('chat cannedReply', () => {
  it('responde instrucciones para subir foto', () => {
    expect(cannedReply('¿Cómo subo una foto?')).toContain('subir una foto');
  });

  it('responde para colecciones', () => {
    expect(cannedReply('muéstrame colecciones')).toContain('colecciones');
  });

  it('responde contacto para prensa', () => {
    expect(cannedReply('contacto de prensa')).toContain('contacto de prensa');
  });

  it('tiene respuesta por defecto', () => {
    expect(cannedReply('algo random')).toContain('contacto@asfaltofashion.example');
  });
});
