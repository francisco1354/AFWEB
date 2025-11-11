// src/components/Auth/RegisterForm.tsx

import React, { useState } from 'react';
import { 
    validarRut, 
    validarCorreo, 
    validarPassword, 
    validarEdad,
    getUsers, 
    saveUser, 
} from '../../utils/validation';
import type { UserData } from '../../utils/validation';

interface RegisterFormProps {
    onSuccess: () => void; // Función para cambiar a Login al registrarse
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    // datos del formulario
    const [formData, setFormData] = useState<UserData>({
        rut: '', nombre: '', fecha_nac: '', correo: '', nombre_usu: '', password: ''
    });
    // mensaje de error
    const [error, setError] = useState('');
    // mensaje de éxito
    const [success, setSuccess] = useState('');

    // manejar cambios en inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (e.target.id === 'rut') {
            value = value.replace(/[^0-9Kk]/g, '').toUpperCase();
            if (value.length > 1) {
                const body = value.slice(0, -1);
                const dv = value.slice(-1);
                value = body + (body ? '-' : '') + dv;
            }
        }
        setFormData({ ...formData, [e.target.id]: value });
        // limpiar error al editar
        setError(''); 
    };

    // Manejo del submit del registro: realiza validaciones básicas y guarda
    // el usuario en localStorage mediante `saveUser`. Esta lógica es local
    // y educativa; en producción habría que enviar los datos a un backend
    // con control de contraseñas y validaciones en servidor.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

    // 1. validaciones básicas
    if (!validarRut(formData.rut)) return setError('RUT inválido. Formato: 12345678-K');
    if (!formData.nombre.trim()) return setError('Ingresa tu nombre.');
    if (!validarEdad(formData.fecha_nac)) return setError('Debes ser mayor de 18 años.');
    if (!validarCorreo(formData.correo)) return setError('Correo inválido.');
    if (!formData.nombre_usu.trim()) return setError('Ingresa un nombre de usuario.');
    if (!validarPassword(formData.password)) return setError('Contraseña debe tener al menos 6 caracteres.');

    // 2. verificar unicidad
    const users = getUsers();
    if (users.some(u => u.rut === formData.rut)) return setError('El RUT ya está registrado.');
    if (users.some(u => u.correo === formData.correo)) return setError('El correo ya está registrado.');
    if (users.some(u => u.nombre_usu === formData.nombre_usu)) return setError('El usuario ya está registrado.');

    // 3. guardar usuario (localStorage)
    saveUser(formData);
    setSuccess('Registro exitoso. Serás redirigido a Iniciar Sesión.');
        
        setTimeout(() => {
            onSuccess();
        }, 1500); 
    };

    return (
        <form id="registerForm" onSubmit={handleSubmit} noValidate>
            <h2>Regístrate</h2>
            
            <label className="field">
                <input type="text" id="rut" placeholder="RUT (ej: 12345678-k)" value={formData.rut} onChange={handleChange} />
            </label>
            <label className="field">
                <input type="text" id="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} />
            </label>
            
            <label htmlFor="fecha_nac" style={{fontSize: '12px', color: '#999', marginTop: '5px'}}>Fecha de Nacimiento</label>
            <label className="field">
                <input type="date" id="fecha_nac" value={formData.fecha_nac} onChange={handleChange} />
            </label>
            
            <label className="field">
                <input type="text" id="correo" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} />
            </label>
            <label className="field">
                <input type="text" id="nombre_usu" placeholder="Nombre de usuario" value={formData.nombre_usu} onChange={handleChange} />
            </label>
            <label className="field">
                <input type="password" id="password" placeholder="Contraseña (mín. 6 chars)" value={formData.password} onChange={handleChange} />
            </label>

            <div className="form-message">
                {error && <span className="field-error">{error}</span>}
                {success && <span className="field-success">{success}</span>}
            </div>
            <button type="submit" disabled={!!success} className="btn-primary">Registrar</button>
            <p className="link">¿Ya tienes cuenta? <a onClick={onSuccess}>Inicia sesión</a></p>
        </form>
    );
};

export default RegisterForm;