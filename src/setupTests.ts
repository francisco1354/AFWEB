import { JSDOM } from 'jsdom';

// Crear un DOM mínimo para las pruebas que usen document/window
const dom = new JSDOM('<!doctype html><html><body></body></html>');

// Copiar propiedades relevantes al globalThis
(globalThis as any).window = dom.window as any;
(globalThis as any).document = dom.window.document as any;
(globalThis as any).navigator = dom.window.navigator as any;
(globalThis as any).Event = dom.window.Event;
(globalThis as any).Node = dom.window.Node;
(globalThis as any).HTMLElement = dom.window.HTMLElement;

// Asegurar localStorage básico si no existe (algunos tests ya lo hacen)
if (typeof (globalThis as any).localStorage === 'undefined') {
  let store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  } as any;
}

// Mapear window.dispatchEvent a globalThis.dispatchEvent para compatibilidad
(globalThis as any).dispatchEvent = (globalThis as any).window.dispatchEvent.bind((globalThis as any).window);

export {};
