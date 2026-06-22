import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ActividadFeed = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarLogs = async () => {
    try {
      const data = await api.obtenerActividad();
      setLogs(data);
    } catch (err) {
      console.error('Error al cargar logs:', err);
      setError('No se pudo obtener el feed de actividad.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLogs();
    
    // Polling automático cada 3 segundos
    const intervalId = setInterval(() => {
      cargarLogs();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const getAccionEstilo = (accion) => {
    switch (accion) {
      case 'RESERVA_CREADA':
        return 'text-emerald-800 bg-emerald-50 border border-emerald-100/55';
      case 'RESERVA_CANCELADA':
        return 'text-red-750 bg-red-50 border border-red-100/55';
      case 'ESTADO_ACTUALIZADO':
        return 'text-blue-800 bg-blue-50 border border-blue-100/55';
      case 'LOGIN_EXITOSO':
        return 'text-amber-800 bg-amber-50 border border-amber-100/55';
      case 'USUARIO_CREADO':
        return 'text-purple-800 bg-purple-50 border border-purple-100/55';
      case 'USUARIO_ELIMINADO':
        return 'text-stone-800 bg-stone-100 border border-stone-200/50';
      default:
        return 'text-stone-700 bg-stone-50 border border-stone-100';
    }
  };

  const formatearFechaLog = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-stone-100 rounded shadow-sm overflow-hidden w-full">
      <div className="p-6 border-b border-stone-100 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">Bitácora de Auditoría Global</h3>
          <p className="text-[10px] text-stone-400 mt-1">
            Historial cronológico de accesos, reservas y modificaciones del personal.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Escaneo Activo
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-400">Cargando bitácora de auditoría...</div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-red-500">{error}</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No se han registrado operaciones en el sistema todavía.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100">
                <th className="py-3 px-6 w-1/4">Fecha y Hora</th>
                <th className="py-3 px-6 w-1/4">Evento</th>
                <th className="py-3 px-6 w-2/4">Detalles de la Operación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-stone-50/20">
                  <td className="py-3.5 px-6 text-stone-450 font-mono text-[10px]">
                    {formatearFechaLog(log.fecha)}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getAccionEstilo(log.accion)}`}>
                      {log.accion.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-stone-600 font-medium leading-relaxed">
                    {log.detalles}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ActividadFeed;
