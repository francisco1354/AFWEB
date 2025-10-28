import React, { useState } from 'react';
import NavBar from '../NavBar';
import '../../styles/FFXIV.css';
import { validarCorreo } from '../../utils/validation';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [success, setSuccess] = useState<string | null>(null);

    const validate = () => {
        const errs: { name?: string; email?: string; message?: string } = {};
        if (!name.trim()) errs.name = 'Por favor indica tu nombre.';
        if (!email.trim()) errs.email = 'Por favor indica un correo.';
        else if (!validarCorreo(email)) errs.email = 'Correo inválido.';
        if (!message.trim() || message.trim().length < 10) errs.message = 'Mensaje muy corto (mínimo 10 caracteres).';
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        setSuccess(null);
        if (Object.keys(errs).length === 0) {
           
            setSuccess('Gracias — tu mensaje fue enviado (demo).');
            setName('');
            setEmail('');
            setMessage('');
         
            window.setTimeout(() => setSuccess(null), 6000);
        }
    };

    return (
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {success && <div className="success-message" role="status">{success}</div>}

            <div className="form-row">
                <label>Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
                {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-row">
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
                {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-row">
                <label>Mensaje</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe tu mensaje" rows={6} />
                {errors.message && <div className="form-error">{errors.message}</div>}
            </div>

            <div style={{ marginTop: 10 }}>
                <button className="btn-primary" type="submit">Enviar</button>
            </div>
        </form>
    );
};

const PaginaContacto: React.FC = () => {
    return (
        <>
            <NavBar />
            <main className="ffxiv-page">
                <header className="ffxiv-header">
                    <h1>Contacto</h1>
                    <p className="ffxiv-sub">Escríbenos para colaboraciones, prensa y prensa técnica.</p>
                </header>

                <section className="ffxiv-hero">
                    <div className="ffxiv-card contact-card">
                        <h2>Contacto de prensa y colaboraciones</h2>
                        <p>Puedes escribirnos a: <strong>contacto@asfaltofashion.example</strong></p>

                        <h3>Formulario rápido</h3>
                        {/* Controlled contact form with inline validation + success message */}
                        <ContactForm />
                        <div style={{ marginTop: 12 }}>
                            <p style={{ margin: 0 }}>También nos puedes encontrar en Instagram:</p>
                            <p style={{ margin: 0 }}>
                                <a href="https://instagram.com/joandoprivadamente" target="_blank" rel="noopener noreferrer">@joandoprivadamente</a>
                                {' '}•{' '}
                                <a href="https://instagram.com/fravvn.jrr" target="_blank" rel="noopener noreferrer">@fravvn.jrr</a>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default PaginaContacto;
