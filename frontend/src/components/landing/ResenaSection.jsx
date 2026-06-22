import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ResenaSection = () => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarResenas = async () => {
      try {
        const data = await api.obtenerResenas();
        setResenas(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron obtener las reseñas de clientes.');
      } finally {
        setLoading(false);
      }
    };
    cargarResenas();
  }, []);

  const renderEstrellas = (calificacion) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3.5 h-3.5 ${index < calificacion ? 'text-amber-600 fill-amber-600' : 'text-stone-200 fill-stone-200'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section id="resenas" className="py-24 bg-[#faf9f6] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">Reseñas</span>
          <h2 className="mt-2 text-3xl font-extrabold text-stone-950 tracking-tight font-serif">Experiencias en Mezanine</h2>
          <p className="mt-4 text-xs text-stone-500 leading-relaxed">
            Testimonios y valoraciones de los comensales que visitaron nuestro salón en San Isidro.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-xs text-stone-400">Cargando opiniones...</div>
        ) : error ? (
          <div className="text-center text-xs text-red-500">{error}</div>
        ) : resenas.length === 0 ? (
          <div className="text-center text-xs text-stone-400">Aún no hay opiniones disponibles.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resenas.map(resena => (
              <div
                key={resena._id}
                className="bg-white border border-stone-100 rounded shadow-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-0.5 mb-4">
                    {renderEstrellas(resena.calificacion)}
                  </div>
                  <p className="text-xs text-stone-600 italic leading-relaxed">
                    "{resena.comentario}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-50 flex justify-between items-center text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                  <span>{resena.cliente_id?.nombre_completo || 'Cliente Anónimo'}</span>
                  <span>{formatearFecha(resena.fecha)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ResenaSection;
