import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(formData.username, formData.password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Credenciales inválidas. Por favor intente de nuevo.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4">
      <div className="max-w-md w-full space-y-8 bg-white border border-stone-150 p-8 rounded shadow-sm">
        <div className="text-center">
          <Link to="/" className="text-xl font-bold tracking-widest text-stone-950 uppercase font-serif">
            MEZANINE
          </Link>
          <h2 className="mt-4 text-xl font-extrabold text-stone-950 tracking-tight font-serif">
            Control Administrativo
          </h2>
          <p className="mt-2 text-xs text-stone-400 font-medium">
            Ingrese sus credenciales para acceder al salón.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="ej. admin"
                className="w-full border border-stone-200 rounded px-4 py-2.5 text-xs shadow-sm focus:ring-1 focus:ring-amber-900 focus:border-amber-900 outline-none bg-white font-medium"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-stone-200 rounded px-4 py-2.5 text-xs shadow-sm focus:ring-1 focus:ring-amber-900 focus:border-amber-900 outline-none bg-white"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <Link to="/" className="font-semibold text-stone-450 hover:text-stone-950 transition-colors">
              ← Volver al sitio público
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded text-white bg-stone-900 hover:bg-stone-850 disabled:bg-stone-300 shadow transition-all outline-none"
            >
              {loading ? 'Validando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
