const Campana = require('../models/Campana');
const Cliente = require('../models/Cliente');
const AuditoriaLog = require('../models/AuditoriaLog');

exports.crearCampana = async (req, res) => {
  const { tipo, asunto, mensaje, segmento_minimo_reservas } = req.body;
  const enviado_por = req.user ? req.user.username : 'admin';

  try {
    if (!tipo || !mensaje || segmento_minimo_reservas === undefined) {
      return res.status(400).json({ message: 'Tipo de campaña, mensaje y segmento mínimo de reservas son obligatorios.' });
    }

    if (!['whatsapp', 'email', 'sms'].includes(tipo)) {
      return res.status(400).json({ message: 'Canal de campaña inválido. Debe ser whatsapp, email o sms.' });
    }

    // Calcular destinatarios segmentados en base al CRM
    const minReservas = parseInt(segmento_minimo_reservas, 10);
    const clientesDestinatarios = await Cliente.find({
      total_reservas_historicas: { $gte: minReservas }
    });

    const totalDestinatarios = clientesDestinatarios.length;

    // Crear registro de la campaña
    const nuevaCampana = new Campana({
      tipo,
      asunto: tipo === 'email' ? (asunto || 'Novedades de Mezanine Gourmet') : undefined,
      mensaje: mensaje.trim(),
      segmento_minimo_reservas: minReservas,
      total_destinatarios: totalDestinatarios,
      enviado_por,
      fecha_envio: new Date()
    });

    await nuevaCampana.save();

    // Registrar en logs de auditoría (Trigger de negocio)
    await AuditoriaLog.create({
      accion: 'ESTADO_ACTUALIZADO',
      entidad_id: nuevaCampana._id,
      detalles: `Campaña [${tipo.toUpperCase()}] enviada a ${totalDestinatarios} clientes con mínimo de ${minReservas} reservas por "${enviado_por}"`,
      fecha: new Date()
    });

    res.status(201).json({
      message: `Campaña simulada enviada con éxito a ${totalDestinatarios} clientes.`,
      campana: nuevaCampana
    });
  } catch (error) {
    console.error('Error al crear campaña:', error);
    res.status(500).json({ message: 'Error interno al procesar el envío de la campaña.' });
  }
};

exports.obtenerCampanas = async (req, res) => {
  try {
    const campanas = await Campana.find({}).sort({ fecha_envio: -1 });
    res.status(200).json(campanas);
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    res.status(500).json({ message: 'Error al obtener el historial de campañas.' });
  }
};
