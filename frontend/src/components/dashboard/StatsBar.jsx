import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatsBar = ({ reservasHoy = [] }) => {
  const [totalClientes, setTotalClientes] = useState(0);

  useEffect(() => {
    const cargarTotalClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiURL = import.meta.env.VITE_API_URL 
          ? `${import.meta.env.VITE_API_URL}/api` 
          : 'http://localhost:5000/api';
        
        // Llamada simple con token
        const response = await axios.get(`${apiURL}/clientes?count=true`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalClientes(response.data.total || 0);
      } catch (err) {
        console.error('Error al obtener total de clientes en stats:', err);
      }
    };
    cargarTotalClientes();
  }, [reservasHoy]); // Recargar si cambian las reservas para reflejar nuevos clientes

  // Calcular métricas
  const totalReservasHoy = reservasHoy.length;
  const totalPersonasHoy = reservasHoy.reduce((acc, curr) => acc + curr.cantidad_personas, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Reservas de Hoy */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
            Reservas de Hoy
          </span>
          <span className="text-3xl font-extrabold text-slate-900">{totalReservasHoy}</span>
        </div>
        <div className="mt-4 text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Solo reservas confirmadas
        </div>
      </div>

      {/* Personas Esperadas */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
            Comensales Esperados Hoy
          </span>
          <span className="text-3xl font-extrabold text-slate-900">{totalPersonasHoy}</span>
        </div>
        <div className="mt-4 text-[10px] text-slate-400 font-semibold">
          Suma total de asistentes confirmados
        </div>
      </div>

      {/* Clientes Registrados */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
            Clientes Registrados (CRM)
          </span>
          <span className="text-3xl font-extrabold text-slate-900">{totalClientes}</span>
        </div>
        <div className="mt-4 text-[10px] text-slate-400 font-semibold">
          Clientes históricos acumulados
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
