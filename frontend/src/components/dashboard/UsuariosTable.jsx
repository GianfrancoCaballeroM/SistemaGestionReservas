import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // Formulario nuevo usuario ampliado
  const [formNuevo, setFormNuevo] = useState({
    nombre_completo: '',
    email: '',
    username: '',
    password: '',
    rol: 'staff'
  });
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');

  const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');

  const cargarUsuarios = async () => {
    try {
      const data = await api.obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError('Error al obtener la lista de usuarios del sistema.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleEliminar = async (id, username) => {
    if (usuarioActual.id === id) {
      alert('No puedes eliminar tu propia cuenta de administrador.');
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${username}"?`)) {
      return;
    }

    try {
      await api.eliminarUsuario(id);
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el usuario.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormNuevo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setFormError('');

    try {
      if (!formNuevo.nombre_completo || !formNuevo.email || !formNuevo.username || !formNuevo.password) {
        setFormError('Por favor complete todos los campos.');
        setGuardando(false);
        return;
      }
      
      await api.crearUsuario(
        formNuevo.nombre_completo,
        formNuevo.email,
        formNuevo.username,
        formNuevo.password,
        formNuevo.rol
      );
      
      setModalAbierto(false);
      setFormNuevo({
        nombre_completo: '',
        email: '',
        username: '',
        password: '',
        rol: 'staff'
      });
      
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error al crear el usuario en el sistema.';
      setFormError(errMsg);
    } finally {
      setGuardando(false);
    }
  };

  const formatearFechaAcceso = (fechaStr) => {
    if (!fechaStr) return <span className="text-stone-400 italic">Nunca</span>;
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white border border-stone-100 rounded shadow-sm overflow-hidden">
      <div className="p-6 border-b border-stone-100 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider font-serif">Gestión de Personal</h3>
          <p className="text-[10px] text-stone-400 mt-1">
            Administración de cuentas con acceso restringido al sistema.
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white bg-stone-900 rounded hover:bg-stone-850 transition-colors shadow-sm outline-none"
        >
          + Registrar Colaborador
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-400">Cargando personal...</div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-red-500">{error}</div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100">
                <th className="py-3.5 px-6">Nombre Completo</th>
                <th className="py-3.5 px-6">Correo</th>
                <th className="py-3.5 px-6">Usuario</th>
                <th className="py-3.5 px-6">Rol</th>
                <th className="py-3.5 px-6">Último Ingreso</th>
                <th className="py-3.5 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {usuarios.map((usr) => (
                <tr key={usr._id} className="hover:bg-stone-50/30">
                  <td className="py-4 px-6 font-semibold text-stone-950">
                    {usr.nombre_completo}
                    {usuarioActual.id === usr._id && (
                      <span className="ml-2 px-1.5 py-0.5 text-[8px] bg-stone-950 text-white rounded font-normal uppercase tracking-wider">
                        Mí Cuenta
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-stone-500">{usr.email}</td>
                  <td className="py-4 px-6 text-stone-600 font-medium">{usr.username}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      usr.rol === 'admin' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {usr.rol}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-stone-500">
                    {formatearFechaAcceso(usr.ultimo_acceso)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEliminar(usr._id, usr.username)}
                      disabled={usuarioActual.id === usr._id}
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                        usuarioActual.id === usr._id
                          ? 'text-stone-300 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Ampliado */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white border border-stone-150 rounded shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h4 className="text-sm font-bold text-stone-900 uppercase font-serif tracking-wider">Registrar Nuevo Colaborador</h4>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-stone-450 hover:text-stone-650 font-bold text-sm outline-none"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCrearUsuario} className="p-6 space-y-4">
              {/* Nombre completo */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  required
                  value={formNuevo.nombre_completo}
                  onChange={handleInputChange}
                  placeholder="ej. Juan Quispe"
                  className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formNuevo.email}
                  onChange={handleInputChange}
                  placeholder="ej. juan.quispe@mezanine.pe"
                  className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-medium"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Nombre de Usuario (Login)
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formNuevo.username}
                  onChange={handleInputChange}
                  placeholder="ej. juan_mezanine"
                  className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-medium"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formNuevo.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Rol de Acceso
                </label>
                <select
                  name="rol"
                  value={formNuevo.rol}
                  onChange={handleInputChange}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-medium"
                >
                  <option value="staff">Personal de Salón / Staff</option>
                  <option value="admin">Administrador General</option>
                </select>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-100 mt-6">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-3 py-1.5 border border-stone-200 rounded text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors outline-none"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm outline-none disabled:bg-stone-300"
                >
                  {guardando ? 'Registrando...' : 'Registrar Colaborador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosTable;
