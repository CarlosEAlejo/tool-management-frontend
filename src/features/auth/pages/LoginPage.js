import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

const initialState = {
  email: '',
  password: '',
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = ({ target }) => {
    setForm((current) => ({
      ...current,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate('/tools', { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Acceso seguro"
      title="Iniciar sesion"
      description="Entra al panel administrativo renovado para gestionar herramientas y futuras categorias desde una sola interfaz."
      footer={
        <p>
          Si aun no existe un administrador, puedes{' '}
          <Link className="font-semibold text-emerald-600 transition hover:text-emerald-500" to="/register">
            registrar el primero aqui
          </Link>
          .
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="ui-label" htmlFor="email">
          Correo
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className="ui-input"
            placeholder="admin@empresa.com"
            required
          />
        </label>

        <label className="ui-label" htmlFor="password">
          Contrasena
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className="ui-input"
            placeholder="Minimo 8 caracteres"
            required
          />
        </label>

        {error ? <div className="ui-error">{error}</div> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#0f766e)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(37,99,235,0.26)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </AuthLayout>
  );
};
