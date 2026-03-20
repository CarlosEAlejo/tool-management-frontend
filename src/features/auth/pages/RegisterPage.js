import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialState = {
  email: '',
  password: '',
  confirmPassword: '',
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
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
      await register(form);
      navigate('/', { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-white p-8 shadow-2xl shadow-slate-950/20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Bootstrap Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Crear administrador inicial</h1>
          <p className="mt-2 text-sm text-slate-600">Este registro solo estara disponible mientras no exista un administrador.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Correo
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="admin@empresa.com"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700" htmlFor="password">
            Contrasena
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Minimo 8 caracteres"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
            Confirmar contrasena
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Repite la contrasena"
              required
            />
          </label>

          {error ? <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear administrador'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Si ya existe un administrador, vuelve a{' '}
          <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">
            iniciar sesion
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
