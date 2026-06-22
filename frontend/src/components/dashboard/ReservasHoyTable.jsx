import React, { useState } from 'react';
import api from '../../services/api';

const ReservasHoyTable = ({ reservas = [], alActualizar }) => {
  const [actualizandoId, setActualizandoId] = useState(null);

  const handleEstadoChange = async (id, nuevoEstado) => {
    setActualizandoId(id);
    try {
      await api.actualizarEstadoReserva(id, nuevoEstado);
      if (alActualizar) {
        alActualizar(); // Refrescar la lista de reservas
      }
    } catch (err) {
      console.error('Error al actualizar estado de la reserva:', err);
      alert('No se pudo actualizar el estado de la reserva.');
    } finally {
      setActualizandoId(null);
    }
  };

  const getBadgeClase = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-100/55';
      case 'pendiente':
        return 'text-amber-800 bg-amber-50 border border-amber-100/55';
      case 'cancelada':
        return 'text-red-700 bg-red-50 border border-red-100/55';
      default:
        return 'text-stone-700 bg-stone-50 border border-stone-100';
    }
  };

  return (
    <div className="bg-white border border-stone-100 rounded shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-100">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">Reservas Confirmadas de Hoy</h3>
        <p className="text-[10px] text-stone-400 mt-1">
          Panel de control en tiempo real para el control de comensales.
        </p>
      </div>

      <div className="overflow-x-auto">
        {reservas.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No hay reservas confirmadas agendadas para el día de hoy.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100">
                <th className="py-3.5 px-6">Cliente</th>
                <th className="py-3.5 px-6">Teléfono</th>
                <th className="py-3.5 px-6">Hora</th>
                <th className="py-3.5 px-6">Personas</th>
                <th className="py-3.5 px-6">Estado</th>
                <th className="py-3.5 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {reservas.map((reserva) => (
                <tr key={reserva._id} className="hover:bg-stone-50/30">
                  <td className="py-4 px-6 font-semibold text-stone-950">
                    {reserva.datos_contacto?.nombre || 'S/N'}
                  </td>
                  <td className="py-4 px-6 text-stone-500 font-medium">
                    {reserva.datos_contacto?.telefono || 'S/T'}
                  </td>
                  <td className="py-4 px-6 font-bold text-stone-950">
                    {reserva.hora_reserva} hs
                  </td>
                  <td className="py-4 px-6 text-stone-600 font-medium">
                    {reserva.cantidad_personas} personas
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getBadgeClase(reserva.estado)}`}>
                      {reserva.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      disabled={actualizandoId === reserva._id}
                      value={reserva.estado}
                      onChange={(e) => handleEstadoChange(reserva._id, e.target.value)}
                      className="border border-stone-200 rounded px-2 py-1 text-xs shadow-sm bg-white outline-none focus:ring-1 focus:ring-amber-900"
                    >
                      <option value="confirmada">Confirmar</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="cancelada">Cancelar</option>
                    </select>
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

export default ReservasHoyTable;
