import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleAdminClick = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold tracking-widest text-stone-950 font-serif">
              MEZANINE
            </Link>
            <span className="text-[10px] ml-2.5 px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-100/50 rounded font-medium">Gourmet</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#menu" className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-amber-800 transition-colors">
              Carta
            </a>
            <a href="#reserva" className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-amber-800 transition-colors">
              Reservar
            </a>
            <a href="#resenas" className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-amber-800 transition-colors">
              Opiniones
            </a>
            
            <button
              onClick={handleAdminClick}
              className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white bg-stone-900 border border-transparent rounded hover:bg-stone-850 hover:border-amber-900/30 transition-all shadow-sm"
            >
              {token ? `Panel (${usuario.username})` : 'Panel Admin'}
            </button>
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={handleAdminClick}
              className="inline-flex items-center justify-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-stone-900 rounded hover:bg-stone-850"
            >
              {token ? 'Panel' : 'Admin'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
