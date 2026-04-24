import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import type { RegisterPayload } from "../../../shared/types";

const initialState: RegisterPayload = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterPayload>(initialState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/tools", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear la cuenta de administrador");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Registro admin"
      title="Crear cuenta de administrador"
      description="Registra un nuevo usuario con acceso administrativo completo al panel."
      accent="from-emerald-600 to-cyan-500"
      footer={
        <p>
          Si ya tienes una cuenta, vuelve a{" "}
          <Link className="font-semibold text-emerald-600 transition hover:text-emerald-500" to="/login">
            iniciar sesion
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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className="ui-input"
            placeholder="Minimo 8 caracteres"
            required
          />
        </label>

        <label className="ui-label" htmlFor="confirmPassword">
          Confirmar contrasena
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="ui-input"
            placeholder="Repite la contrasena"
            required
          />
        </label>

        {error ? <div className="ui-error">{error}</div> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#059669,#0891b2)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(5,150,105,0.24)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creando cuenta..." : "Crear administrador"}
        </button>
      </form>
    </AuthLayout>
  );
};

