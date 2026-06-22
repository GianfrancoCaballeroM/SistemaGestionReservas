import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OcupacionChart = () => {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoyStr);
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarOcupacion = async (fechaQuery) => {
    setLoading(true);
    setError('');
    try {
      const result = await api.obtenerOcupacionPorHora(fechaQuery);
      setDatos(result);
    } catch (err) {
      console.error(err);
      setError('Error al obtener la ocupación para la fecha seleccionada.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOcupacion(fecha);
  }, [fecha]);

  // Cálculos estadísticos para el panel analítico derecho
  const totalReservas = datos.reduce((acc, curr) => acc + curr.total_reservas, 0);
  const totalPersonas = datos.reduce((acc, curr) => acc + curr.total_personas, 0);
  
  // Buscar la hora pico
  let horaPico = 'N/A';
  let maxPersonas = 0;
  datos.forEach(item => {
    if (item.total_personas > maxPersonas) {
      maxPersonas = item.total_personas;
      horaPico = item.hora;
    }
  });

  return (
    <div className="bg-white border border-stone-100 rounded shadow-sm overflow-hidden w-full">
      <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">Análisis de Ocupación y Flujo</h3>
          <p className="text-[10px] text-stone-400 mt-1">
            Métricas de comensales y reservas estimadas por intervalos horarios.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 shrink-0">
            Fecha:
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border border-stone-200 rounded px-2 py-1.5 text-xs shadow-sm bg-white outline-none focus:ring-1 focus:ring-amber-900 w-full sm:w-auto font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-stone-400">Calculando métricas analíticas...</div>
      ) : error ? (
        <div className="text-center py-12 text-xs text-red-500">{error}</div>
      ) : datos.length === 0 ? (
        <div className="text-center py-12 text-xs text-stone-400">
          No se registran datos de aforo para el día seleccionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
          {/* Columna 1 y 2: Tabla de Ocupación */}
          <div className="p-6 lg:col-span-2">
            <div className="overflow-x-auto border border-stone-100 rounded">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-stone-100">
                    <th className="py-2.5 px-4">Intervalo Horario</th>
                    <th className="py-2.5 px-4 text-center">Muestras / Reservas</th>
                    <th className="py-2.5 px-4 text-right">Total Personas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {datos.map((item) => (
                    <tr key={item.hora} className="hover:bg-stone-50/20">
                      <td className="py-3 px-4 font-semibold text-stone-950">{item.hora} hs</td>
                      <td className="py-3 px-4 text-center font-semibold text-stone-550">
                        {item.total_reservas}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-amber-900">
                        {item.total_personas} comensales
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Columna 3: Tarjeta de Resumen de Aforo */}
          <div className="p-6 bg-stone-50/45 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                Resumen de Aforo
              </h4>
              
              {/* Tarjetas de micro-kpis */}
              <div className="space-y-4">
                <div className="bg-white border border-stone-100 p-4 rounded shadow-sm">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                    Total Comensales
                  </span>
                  <span className="text-xl font-bold text-stone-900 mt-1 block">
                    {totalPersonas} personas
                  </span>
                  <span className="text-[8px] text-stone-400 block mt-0.5">
                    Distribuidos en {totalReservas} reservas
                  </span>
                </div>

                <div className="bg-white border border-stone-100 p-4 rounded shadow-sm">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                    Horario Pico
                  </span>
                  <span className="text-xl font-bold text-amber-900 mt-1 block">
                    {horaPico} hs
                  </span>
                  <span className="text-[8px] text-stone-400 block mt-0.5">
                    Máximo de {maxPersonas} personas concurrentes
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 text-[10px] text-stone-400 leading-relaxed">
              💡 <strong>Recomendación Gourmet:</strong> Planifique la rotación de mesas y refuerzos de staff basándose en el Horario Pico para mantener los estándares de excelencia del salón.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OcupacionChart;
