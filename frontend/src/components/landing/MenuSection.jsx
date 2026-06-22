import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import MenuCard from './MenuCard';

const MenuSection = () => {
  const [platos, setPlatos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categorias = [
    { id: 'todos', label: 'Todos' },
    { id: 'entradas', label: 'Entradas' },
    { id: 'fondos', label: 'Segundos' },
    { id: 'bebidas', label: 'Bebidas' },
    { id: 'postres', label: 'Postres' }
  ];

  useEffect(() => {
    const cargarMenu = async () => {
      try {
        const data = await api.obtenerMenu();
        setPlatos(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la carta en este momento.');
      } finally {
        setLoading(false);
      }
    };
    cargarMenu();
  }, []);

  const platosFiltrados = categoriaActiva === 'todos'
    ? platos
    : platos.filter(plato => plato.categoria === categoriaActiva);

  return (
    <section id="menu" className="py-24 bg-[#faf9f6] border-b border-stone-100 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">La Carta</span>
          <h2 className="mt-2 text-3xl font-extrabold text-stone-950 tracking-tight font-serif">Nuestra Propuesta Gastronómica</h2>
          <p className="mt-4 text-xs text-stone-500 leading-relaxed">
            Una fina selección de platos elaborados con ingredientes andinos y marinos frescos de estación.
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded border transition-all ${
                categoriaActiva === cat.id
                  ? 'bg-stone-900 border-stone-900 text-white shadow-sm'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Contenedor de Platos */}
        {loading ? (
          <div className="mt-12 text-center text-xs text-stone-400">Cargando menú...</div>
        ) : error ? (
          <div className="mt-12 text-center text-xs text-red-500 bg-red-50 p-4 rounded-md max-w-md mx-auto">{error}</div>
        ) : platosFiltrados.length === 0 ? (
          <div className="mt-12 text-center text-xs text-stone-400">No hay platos disponibles en esta categoría.</div>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {platosFiltrados.map(plato => (
              <MenuCard key={plato._id} plato={plato} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
