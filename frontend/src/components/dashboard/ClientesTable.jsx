import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ClientesTable = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para el Drawer lateral del cliente seleccionado
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [comentarioNota, setComentarioNota] = useState('');
  const [guardandoNota, setGuardandoNota] = useState(false);

  const cargarClientes = async () => {
    try {
      const data = await api.obtenerClientes();
      setClientes(data);
      
      // Si hay un cliente seleccionado en el panel lateral, actualizar su información
      if (clienteSeleccionado) {
        const clienteActualizado = data.find(c => c._id === clienteSeleccionado._id);
        if (clienteActualizado) {
          setClienteSeleccionado(clienteActualizado);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Error al obtener la lista de clientes en el CRM.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleAgregarNota = async (e) => {
    e.preventDefault();
    if (!comentarioNota.trim() || !clienteSeleccionado) return;

    setGuardandoNota(true);
    try {
      const response = await api.agregarNotaCliente(clienteSeleccionado._id, comentarioNota);
      setComentarioNota('');
      // Recargar clientes y el drawer
      await cargarClientes();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la nota de staff.');
    } finally {
      setGuardandoNota(false);
    }
  };

  const handleEliminarNota = async (notaId) => {
    if (!clienteSeleccionado || !window.confirm('¿Desea eliminar este recordatorio del cliente?')) return;

    try {
      await api.eliminarNotaCliente(clienteSeleccionado._id, notaId);
      await cargarClientes();
    } catch (err) {
      console.error(err);
      alert('Error al remover la nota.');
    }
  };

  const formatearFechaNota = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative flex flex-col lg:flex-row gap-6">
      {/* Tabla de Clientes (Principal) */}
      <div className="flex-1 bg-white border border-stone-100 rounded shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <h3 className="text-sm font-bold text-stone-900 uppercase font-serif tracking-wider">Planilla de Clientes (CRM)</h3>
          <p className="text-[10px] text-stone-400 mt-1">
            Listado histórico de clientes. Hacé clic sobre una fila para abrir su ficha lateral y gestionar notas.
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-stone-400">Cargando CRM...</div>
          ) : error ? (
            <div className="p-12 text-center text-xs text-red-500">{error}</div>
          ) : clientes.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">
              No se han registrado perfiles de clientes en el CRM.
            </div>
          ) : (
            <table className="w-full text-left border-collapse cursor-pointer">
              <thead>
                <tr className="bg-stone-50 text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100">
                  <th className="py-3.5 px-6">Cliente</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Teléfono</th>
                  <th className="py-3.5 px-6">Preferencias</th>
                  <th className="py-3.5 px-6 text-right">Reservas Totales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {clientes.map((cliente) => (
                  <tr
                    key={cliente._id}
                    onClick={() => setClienteSeleccionado(cliente)}
                    className={`transition-colors ${
                      clienteSeleccionado?._id === cliente._id
                        ? 'bg-amber-50/40 hover:bg-amber-50/50'
                        : 'hover:bg-stone-50/30'
                    }`}
                  >
                    <td className="py-4 px-6 font-semibold text-stone-950">
                      {cliente.nombre_completo}
                    </td>
                    <td className="py-4 px-6 text-stone-500 font-medium">{cliente.email}</td>
                    <td className="py-4 px-6 text-stone-500 font-mono">{cliente.telefono}</td>
                    <td className="py-4 px-6">
                      {cliente.preferencias.length === 0 ? (
                        <span className="text-[9px] italic text-stone-450">Ninguna</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {cliente.preferencias.map((pref, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[8px] font-bold uppercase"
                            >
                              {pref}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-stone-100 text-stone-800 rounded">
                        {cliente.total_reservas_historicas}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PANEL LATERAL / DRAWER DE FICHA DE CLIENTE */}
      {clienteSeleccionado && (
        <div className="w-full lg:w-96 bg-white border border-stone-150 rounded shadow-sm flex flex-col justify-between shrink-0 h-fit lg:sticky lg:top-20">
          <div>
            {/* Cabecera del Drawer */}
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/30">
              <div>
                <h4 className="text-xs font-bold text-stone-950 uppercase font-serif tracking-wider">
                  Ficha del Consumidor
                </h4>
                <p className="text-[9px] text-stone-400 mt-0.5">Seguimiento y notas de salón.</p>
              </div>
              <button
                onClick={() => setClienteSeleccionado(null)}
                className="text-stone-400 hover:text-stone-650 font-bold text-xs outline-none"
              >
                Cerrar ✕
              </button>
            </div>

            {/* Datos Personales */}
            <div className="p-6 border-b border-stone-100 space-y-3">
              <div>
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block">
                  Cliente
                </span>
                <span className="text-xs font-bold text-stone-900 mt-1 block">
                  {clienteSeleccionado.nombre_completo}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block">
                    Correo
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5 block truncate">
                    {clienteSeleccionado.email}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block">
                    Teléfono
                  </span>
                  <span className="text-[10px] text-stone-500 mt-0.5 block font-mono">
                    {clienteSeleccionado.telefono}
                  </span>
                </div>
              </div>
            </div>

            {/* Listado de Notas de Staff */}
            <div className="p-6 border-b border-stone-100">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-amber-800 mb-4">
                Notas y Alergias (Staff)
              </h5>
              
              {clienteSeleccionado.notas_staff?.length === 0 ? (
                <p className="text-center py-4 text-[10px] text-stone-400 italic">
                  No se registran notas de staff para este cliente.
                </p>
              ) : (
                <div className="space-y-3.5 max-h-[200px] overflow-y-auto pr-1">
                  {clienteSeleccionado.notas_staff.map((nota) => (
                    <div key={nota._id} className="bg-stone-50/50 border border-stone-100 p-3 rounded flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-bold text-stone-850 uppercase">
                          👤 {nota.autor}
                        </span>
                        <button
                          onClick={() => handleEliminarNota(nota._id)}
                          className="text-[9px] font-bold text-red-500 hover:text-red-700 transition-colors uppercase outline-none"
                        >
                          Quitar
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-650 mt-1.5 leading-snug">
                        {nota.comentario}
                      </p>
                      <span className="text-[8px] text-stone-400 block mt-2 text-right">
                        {formatearFechaNota(nota.fecha)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulario para añadir Nota */}
          <div className="p-6 bg-stone-50/30">
            <form onSubmit={handleAgregarNota} className="space-y-3">
              <div>
                <label className="block text-[8px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Agregar Recordatorio / Alerta
                </label>
                <textarea
                  required
                  rows="2"
                  value={comentarioNota}
                  onChange={(e) => setComentarioNota(e.target.value)}
                  placeholder="ej. Alérgico al maní. Prefiere mesa redonda."
                  className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-medium resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={guardandoNota || !comentarioNota.trim()}
                className="w-full inline-flex items-center justify-center px-3 py-2 text-[9px] font-bold uppercase tracking-wider rounded text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 transition-colors shadow outline-none"
              >
                {guardandoNota ? 'Guardando...' : 'Guardar Nota'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesTable;
