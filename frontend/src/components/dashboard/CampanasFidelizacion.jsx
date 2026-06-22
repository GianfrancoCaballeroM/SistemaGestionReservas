import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CampanasFidelizacion = ({ alEnviarCampaña }) => {
  const [campanas, setCampanas] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  const [errorHistorial, setErrorHistorial] = useState('');
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    tipo: 'whatsapp',
    asunto: '',
    mensaje: '',
    segmento_minimo_reservas: 1
  });
  const [enviando, setEnviando] = useState(false);
  const [feedbackEnvio, setFeedbackEnvio] = useState({ tipo: '', texto: '' });

  const cargarCampanas = async () => {
    try {
      const data = await api.obtenerCampanas();
      setCampanas(data);
    } catch (err) {
      console.error(err);
      setErrorHistorial('No se pudo obtener el historial de campañas.');
    } finally {
      setLoadingHistorial(false);
    }
  };

  useEffect(() => {
    cargarCampanas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setFeedbackEnvio({ tipo: '', texto: '' });

    try {
      const response = await api.crearCampana({
        tipo: formData.tipo,
        asunto: formData.tipo === 'email' ? formData.asunto : undefined,
        mensaje: formData.mensaje,
        segmento_minimo_reservas: parseInt(formData.segmento_minimo_reservas, 10)
      });

      setFeedbackEnvio({
        tipo: 'exito',
        texto: response.message || 'Campaña enviada con éxito.'
      });

      // Limpiar formulario excepto segmentación
      setFormData({
        tipo: 'whatsapp',
        asunto: '',
        mensaje: '',
        segmento_minimo_reservas: 1
      });

      // Recargar historial de campañas
      cargarCampanas();
      
      // Callback por si el componente padre necesita refrescar algo (como logs)
      if (alEnviarCampaña) alEnviarCampaña();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error al procesar el envío de la campaña.';
      setFeedbackEnvio({ tipo: 'error', texto: errMsg });
    } finally {
      setEnviando(false);
    }
  };

  const getCanalBadge = (tipo) => {
    switch (tipo) {
      case 'whatsapp':
        return 'text-emerald-700 bg-emerald-50 border border-emerald-100';
      case 'email':
        return 'text-blue-700 bg-blue-50 border border-blue-100';
      case 'sms':
        return 'text-stone-700 bg-stone-100 border border-stone-200/50';
      default:
        return 'text-stone-600 bg-stone-50';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulario de Envío (1/3 de ancho) */}
      <div className="bg-white border border-stone-100 rounded shadow-sm p-6 h-fit">
        <h3 className="text-sm font-bold text-stone-900 uppercase font-serif tracking-wider mb-1">
          Crear Campaña de Fidelización
        </h3>
        <p className="text-[10px] text-stone-400 mb-6 leading-relaxed">
          Diseñe y envíe comunicados promocionales masivos segmentados según la recurrencia de sus comensales.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo / Canal */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Canal de Comunicación
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-medium"
            >
              <option value="whatsapp">WhatsApp (Simulación Regional)</option>
              <option value="email">Correo Electrónico (Simulación HTML)</option>
              <option value="sms">Mensaje de Texto SMS (Capa Móvil)</option>
            </select>
          </div>

          {/* Asunto (Solo si es Email) */}
          {formData.tipo === 'email' && (
            <div>
              <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Asunto del Correo
              </label>
              <input
                type="text"
                name="asunto"
                required
                value={formData.asunto}
                onChange={handleChange}
                placeholder="ej. ¡Fin de semana en Mezanine Gourmet!"
                className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-medium"
              />
            </div>
          )}

          {/* Mensaje */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Cuerpo del Mensaje
            </label>
            <textarea
              name="mensaje"
              required
              rows="5"
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Escriba su mensaje aquí. Puede incluir promociones, saludos, etc."
              className="w-full border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-medium resize-none"
            />
          </div>

          {/* Segmentación */}
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Segmentar por visitas (Mínimo)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="segmento_minimo_reservas"
                required
                min="0"
                value={formData.segmento_minimo_reservas}
                onChange={handleChange}
                className="w-24 border border-stone-200 rounded px-3 py-2 text-xs shadow-sm outline-none focus:ring-1 focus:ring-amber-900 bg-white font-bold"
              />
              <span className="text-[10px] text-stone-400 font-medium">
                reservas históricas
              </span>
            </div>
          </div>

          {/* Feedback */}
          {feedbackEnvio.texto && (
            <div className={`p-3 rounded text-[11px] font-semibold border ${
              feedbackEnvio.tipo === 'exito'
                ? 'bg-amber-50 text-amber-900 border-amber-200/50'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {feedbackEnvio.texto}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded text-white bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 transition-colors shadow outline-none"
          >
            {enviando ? 'Enviando...' : 'Enviar Comunicado'}
          </button>
        </form>
      </div>

      {/* Historial (2/3 de ancho) */}
      <div className="bg-white border border-stone-100 rounded shadow-sm overflow-hidden lg:col-span-2">
        <div className="p-6 border-b border-stone-100">
          <h3 className="text-sm font-bold text-stone-900 uppercase font-serif tracking-wider">
            Historial de Campañas Enviadas
          </h3>
          <p className="text-[10px] text-stone-400 mt-1">
            Registro de comunicados masivos emitidos desde el sistema.
          </p>
        </div>

        <div className="overflow-x-auto">
          {loadingHistorial ? (
            <div className="p-12 text-center text-xs text-stone-400">Cargando historial...</div>
          ) : errorHistorial ? (
            <div className="p-12 text-center text-xs text-red-500">{errorHistorial}</div>
          ) : campanas.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">
              No se registran campañas masivas enviadas en el historial.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-[10px] uppercase font-bold tracking-wider text-stone-400 border-b border-stone-100">
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Canal</th>
                  <th className="py-3 px-4">Destinatarios</th>
                  <th className="py-3 px-4">Mensaje</th>
                  <th className="py-3 px-4 text-right">Emisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {campanas.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50/20">
                    <td className="py-4 px-4 text-stone-450 font-mono text-[10px]">
                      {new Date(c.fecha_envio).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${getCanalBadge(c.tipo)}`}>
                        {c.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-stone-900">
                      {c.total_destinatarios} clientes
                      <span className="block text-[8px] font-normal text-stone-400">
                        (visitas &gt;= {c.segmento_minimo_reservas})
                      </span>
                    </td>
                    <td className="py-4 px-4 text-stone-550 max-w-[200px] truncate leading-normal" title={c.mensaje}>
                      {c.asunto && <strong className="block text-[10px] text-stone-900 font-bold">Asunto: {c.asunto}</strong>}
                      {c.mensaje}
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-stone-900">
                      {c.enviado_por}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampanasFidelizacion;
