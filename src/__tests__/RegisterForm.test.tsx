import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from '../components/Auth/RegisterForm';
import { describe, it, expect, beforeEach } from 'vitest';
import { getUsers } from '../utils/validation';

// Setup básico de localStorage en entorno de tests
if (typeof globalThis.localStorage === 'undefined') {
  let store: Record<string, string> = {};
  globalThis.localStorage = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  } as any;
}

describe('RegisterForm component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra error para RUT inválido y registra usuario válido', () => {
    const onSuccess = () => {};
    render(<RegisterForm onSuccess={onSuccess} />);

    // intentar enviar form vacío -> validación de RUT
    const submitBtn = screen.getByRole('button', { name: /Registrar/i });
    fireEvent.click(submitBtn);
    expect(screen.getByText(/RUT inválido/i)).toBeTruthy();

    // completar formulario con datos válidos
    fireEvent.change(screen.getByPlaceholderText(/RUT/i), { target: { value: '12345678-5' } });
    fireEvent.change(screen.getByPlaceholderText(/Nombre completo/i), { target: { value: 'Tester Uno' } });
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 't1@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Nombre de usuario/i), { target: { value: 'tester1' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'abcdef' } });

    fireEvent.click(submitBtn);

    // Debe haber persistido el usuario
    const users = getUsers();
    expect(users.some(u => u.nombre_usu === 'tester1')).toBe(true);
  });
});
