import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { handleFormInvalid } from '../../lib/validation';
import TermopharmaLogo from '../../components/TermopharmaLogo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Demasiados intentos fallidos. Reintente en 15 minutos.');
      } else {
        setError('Credenciales incorrectas');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="panel hidden overflow-hidden bg-[var(--color-primary)] text-white lg:flex lg:flex-col lg:justify-between">
          <div className="px-8 py-8">
            <div className="max-w-[240px] rounded-[24px] border border-white/10 bg-white/10 p-4">
              <TermopharmaLogo className="w-full" compact />
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Acceso interno</p>
            <h1 className="mt-3 font-['var(--font-heading)'] text-5xl font-bold leading-tight">
              Gestion farmacéutica sobria, clara y trazable.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/80">
              Panel operativo para controlar movimientos, stock, remitos y documentación sin ruido visual innecesario.
            </p>
          </div>
          <div className="border-t border-white/10 px-8 py-6 text-sm text-white/70">
            Drogueria Termopharma DGroup
          </div>
        </section>

        <section className="panel my-auto w-full max-w-xl justify-self-center p-8 sm:p-10">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Inicio de sesion</p>
            <h2 className="font-['var(--font-heading)'] text-4xl font-bold text-[var(--color-primary)]">
              Inventario Farmaceutico
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Ingrese con su usuario autorizado para acceder al panel interno.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="space-y-5 font-['var(--font-body)']">
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                required
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Contrasena</label>
              <input
                type="password"
                required
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="primary-button mt-2 w-full disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesion'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
