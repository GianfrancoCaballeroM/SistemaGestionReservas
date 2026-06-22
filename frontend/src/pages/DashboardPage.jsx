import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Componentes
import StatsBar from '../components/dashboard/StatsBar';
import ReservasTable from '../components/dashboard/ReservasTable';
import OcupacionChart from '../components/dashboard/OcupacionChart';
import ActividadFeed from '../components/dashboard/ActividadFeed';
import ClientesTable from '../components/dashboard/ClientesTable';
import UsuariosTable from '../components/dashboard/UsuariosTable';
import CampanasFidelizacion from '../components/dashboard/CampanasFidelizacion'; // NUEVO

const DashboardPage = () => {
  const navigate = useNavigate();
  const hoyStr = new Date().toISOString().split('T')[0];

  // Estados
  const [reservasHoyVista, setReservasHoyVista] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [fechaReservas, setFechaReservas] = useState(hoyStr);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [error, setError] = useState('');
  const [seccionActiva, setSeccionActiva] = useState('reservas'); // 'reservas' | 'crm' | 'usuarios' | 'auditoria'

  // Sub-sección interna para el CRM
  const [subSeccionCrm, setSubSeccionCrm] = useState('crm_lista'); // 'crm_lista' | 'crm_campanas'

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const cargarStats = async () => {
    try {
      const data = await api.obtenerReservasHoy();
      setReservasHoyVista(data);
    } catch (err) {
      console.error('Error al cargar stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const cargarReservasFiltradas = async () => {
    setLoadingReservas(true);
    try {
      const data = await api.obtenerTodasReservas(fechaReservas);
      setReservasFiltradas(data);
    } catch (err) {
      console.error('Error al cargar reservas de la planilla:', err);
      setError('No se pudieron obtener las reservas para la fecha seleccionada.');
    } finally {
      setLoadingReservas(false);
    }
  };

  useEffect(() => {
    cargarStats();
  }, []);

  useEffect(() => {
    cargarReservasFiltradas();
  }, [fechaReservas]);

  const handleActualizacionReserva = () => {
    cargarReservasFiltradas();
    cargarStats();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-row">
      {/* SIDEBAR A LA IZQUIERDA */}
      <aside className="w-64 bg-white border-r border-stone-100 flex flex-col justify-between shrink-0 shadow-sm hidden md:flex">
        <div>
          {/* Logo del Sidebar */}
          <div className="h-16 border-b border-stone-100 flex items-center px-6">
            <span className="text-sm font-extrabold tracking-widest text-stone-950 font-serif">
              MEZANINE
            </span>
            <span className="ml-2 px-1.5 py-0.5 text-[8px] bg-amber-50 text-amber-800 border border-amber-100/50 rounded font-bold uppercase">
              Admin
            </span>
          </div>

          {/* Menú de Navegación Vertical */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setSeccionActiva('reservas')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all outline-none ${
                seccionActiva === 'reservas'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <span className="text-sm">📅</span>
              Gestionar Reservas
            </button>

            <button
              onClick={() => {
                setSeccionActiva('crm');
                setSubSeccionCrm('crm_lista');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all outline-none ${
                seccionActiva === 'crm'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <span className="text-sm">👥</span>
              Gestionar Clientes
            </button>

            <button
              onClick={() => setSeccionActiva('auditoria')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all outline-none ${
                seccionActiva === 'auditoria'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-500 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <span className="text-sm">📋</span>
              Auditoría del Sistema
            </button>

            {usuario.rol === 'admin' && (
              <button
                onClick={() => setSeccionActiva('usuarios')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all outline-none ${
                  seccionActiva === 'usuarios'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-950 hover:bg-stone-50'
                }`}
              >
                <span className="text-sm">🔑</span>
                Gestionar Staff
              </button>
            )}
          </nav>
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200/50 flex items-center justify-center text-xs font-bold text-amber-800 uppercase">
              {usuario.username?.substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-stone-900 truncate">{usuario.username}</p>
              <p className="text-[9px] uppercase tracking-widest text-amber-700 font-bold truncate">
                {usuario.rol}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENEDOR DE LA DERECHA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-stone-100 shadow-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-xs font-extrabold tracking-widest text-stone-950 font-serif">
              MEZANINE
            </span>
          </div>

          <div className="text-xs text-stone-400 font-medium hidden sm:block">
            Sistema de Reserva de Mesas · Perú
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex md:hidden gap-1">
              <button 
                onClick={() => setSeccionActiva('reservas')}
                className={`px-2 py-1 text-[9px] font-bold rounded ${seccionActiva === 'reservas' ? 'bg-stone-900 text-white' : 'text-stone-500'}`}
              >
                Reservas
              </button>
              <button 
                onClick={() => {
                  setSeccionActiva('crm');
                  setSubSeccionCrm('crm_lista');
                }}
                className={`px-2 py-1 text-[9px] font-bold rounded ${seccionActiva === 'crm' ? 'bg-stone-900 text-white' : 'text-stone-500'}`}
              >
                Clientes
              </button>
              <button 
                onClick={() => setSeccionActiva('auditoria')}
                className={`px-2 py-1 text-[9px] font-bold rounded ${seccionActiva === 'auditoria' ? 'bg-stone-900 text-white' : 'text-stone-500'}`}
              >
                Auditoría
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-stone-200 rounded text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-950 transition-colors outline-none"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {seccionActiva === 'reservas' && (
            <div className="space-y-8">
              {/* KPIs Superiores */}
              {loadingStats ? (
                <div className="text-center py-6 text-xs text-stone-400">Calculando estadísticas...</div>
              ) : (
                <StatsBar reservasHoy={reservasHoyVista} />
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-semibold">
                  {error}
                </div>
              )}
              
              {/* Tabla de Reservas */}
              <ReservasTable
                reservas={reservasFiltradas}
                fecha={fechaReservas}
                alCambiarFecha={setFechaReservas}
                alActualizar={handleActualizacionReserva}
                loading={loadingReservas}
              />

              {/* Panel de Agregación de Ocupación por Hora */}
              <div className="w-full">
                <OcupacionChart />
              </div>
            </div>
          )}

          {seccionActiva === 'crm' && (
            <div className="space-y-8">
              {/* Sub-navegación interna del CRM */}
              <div className="border-b border-stone-100 flex gap-6 pb-2.5">
                <button
                  onClick={() => setSubSeccionCrm('crm_lista')}
                  className={`text-xs font-bold uppercase tracking-wider transition-all outline-none ${
                    subSeccionCrm === 'crm_lista'
                      ? 'text-amber-800 border-b border-amber-800 pb-2.5 -mb-[11px]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  Planilla de Clientes
                </button>
                <button
                  onClick={() => setSubSeccionCrm('crm_campanas')}
                  className={`text-xs font-bold uppercase tracking-wider transition-all outline-none ${
                    subSeccionCrm === 'crm_campanas'
                      ? 'text-amber-800 border-b border-amber-800 pb-2.5 -mb-[11px]'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  Campañas de Fidelización
                </button>
              </div>

              {/* Contenido Condicional */}
              <div className="pt-4">
                {subSeccionCrm === 'crm_lista' ? (
                  <ClientesTable />
                ) : (
                  <CampanasFidelizacion />
                )}
              </div>
            </div>
          )}

          {seccionActiva === 'auditoria' && (
            <div className="space-y-8">
              <div className="w-full">
                <ActividadFeed />
              </div>
            </div>
          )}

          {seccionActiva === 'usuarios' && usuario.rol === 'admin' && (
            <div className="space-y-8">
              <UsuariosTable />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
