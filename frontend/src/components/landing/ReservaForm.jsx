import React, { useState } from 'react';
import api from '../../services/api';

const ReservaForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fecha_reserva: '',
    hora_reserva: '20:00',
    cantidad_personas: 2
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const horasDisponibles = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];

  const hoyStr = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    // Validar teléfono básico de 9 dígitos de Perú
    const telLimpio = formData.telefono.replace(/\D/g, '');
    if (telLimpio.length < 9) {
      setMensaje({
        tipo: 'error',
        texto: 'Por favor ingrese un número de teléfono válido de 9 dígitos.'
      });
      setLoading(false);
      return;
    }

    try {
      // Anteponer el código de Perú si no lo tiene
      const telefonoPeru = formData.telefono.startsWith('+51') 
        ? formData.telefono 
        : `+51 ${formData.telefono}`;

      const response = await api.crearReserva({
        ...formData,
        telefono: telefonoPeru,
        cantidad_personas: parseInt(formData.cantidad_personas, 10)
      });
      
      setMensaje({
        tipo: 'exito',
        texto: response.message || 'Su solicitud de reserva ha sido enviada con éxito. Evaluaremos el aforo y le confirmaremos a la brevedad.'
      });
      
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        fecha_reserva: '',
        hora_reserva: '20:00',
        cantidad_personas: 2
      });
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Hubo un problema al procesar su solicitud. Intente nuevamente.';
      setMensaje({
        tipo: 'error',
        texto: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reserva" className="py-24 bg-white border-b border-stone-100 scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">Reservaciones</span>
          <h2 className="mt-2 text-3xl font-extrabold text-stone-950 tracking-tight font-serif">Planifique su Visita</h2>
          <p className="mt-4 text-xs text-stone-500 leading-relaxed">
            Reserve su mesa en línea. Nuestro equipo confirmará su reservación por correo electrónico o teléfono.
          </p>
        </div>

        <div className="bg-[#faf9f6] border border-stone-100 rounded shadow-sm p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nombre completo */}
              <div>
                <label htmlFor="nombre" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="ej. Juan Pérez"
                  className="w-full border border-stone-200 rounded px-4 py-2.5 text-xs shadow-sm focus:ring-1 focus:ring-amber-900 focus:border-amber-900 outline-none bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ej. juan.perez@correo.com"
                  className="w-full border border-stone-200 rounded px-4 py-2.5 text-xs shadow-sm focus:ring-1 focus:ring-amber-900 focus:border-amber-900 outline-none bg-white"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Teléfono de Contacto (Perú)
                </label>
                <input
                  type="tel"
                  name="telefono"
                  id="telefono"
                  required
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="ej. 987654321"
                  className="w-full border border-stone-200 rounded px-4 py-2.5 text-xs shadow-sm focus:ring-1 focus:ring-amber-900 focus:border-amber-900 outline-none bg-white"
                />
              </div>

              {/* Cantidad de personas */}
              <div>
                <label htmlFor="cantidad_personas" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Cantidad de Personas
                </label>
                <input
                  type="number"
                  name="cantidad_personas"
                  id="cantidad_personas"
                  required
                  min="1"
                  max="20"
                  value={formData.cantidad_personas}
                  onChange={handleChange}
                  className="w-full border border-stone-200 rounded px-4 py-2.5 text-xs shadow-sm focus:ring-1 focus:ring-amber-900 focus:border-amber-900 outline-none bg-white"
                />
              </div>

              {/* Fecha de la reserva */}
              <div>
                <label htmlFor="fecha_reserva" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha_reserva"
                  id="fecha_reserva"
                  required
                  min={hoyStr}
                  value={formData.fecha_reserva}
                  onChange={handleChange}
                  className="w-full border border-stone-200 rounded px-4 py-2.5 text-xs shadow-sm focus:ring-1 focus:ring-amber-900 focus:border-amber-900 outline-none bg-white"
                />
              </div>

              {/* Hora de la reserva */}
              <div>
                <label htmlFor="hora_reserva" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Hora
                </label>
                <select
                  name="hora_reserva"
                  id="hora_reserva"
                  required
                  value={formData.hora_reserva}
                  onChange={handleChange}
                  className="w-full border border-stone-200 rounded px-4 py-2.5 text-xs shadow-sm focus:ring-1 focus:ring-amber-900 focus:border-amber-900 outline-none bg-white"
                >
                  {horasDisponibles.map(hora => (
                    <option key={hora} value={hora}>
                      {hora} hs
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mensajes de feedback */}
            {mensaje.texto && (
              <div
                className={`p-4 rounded text-xs font-semibold border ${
                  mensaje.tipo === 'exito'
                    ? 'bg-amber-50 text-amber-900 border-amber-200/50'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {mensaje.texto}
              </div>
            )}

            {/* Botón de envío */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-xs font-bold uppercase tracking-wider rounded text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 shadow transition-all outline-none"
              >
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReservaForm;
