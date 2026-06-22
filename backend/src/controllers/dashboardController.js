const mongoose = require('mongoose');
const Reserva = require('../models/Reserva');
const AuditoriaLog = require('../models/AuditoriaLog');

exports.obtenerReservasHoy = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const reservasHoy = await db.collection('v_reservas_hoy').find({}).toArray();
    res.status(200).json(reservasHoy);
  } catch (error) {
    console.error('Error al consultar la vista de reservas de hoy:', error);
    res.status(500).json({ message: 'Error al obtener las reservas del día.' });
  }
};

exports.obtenerTodasReservas = async (req, res) => {
  const { fecha } = req.query; // Espera formato YYYY-MM-DD

  try {
    let targetDateStr = fecha;
    if (!targetDateStr) {
      targetDateStr = new Date().toISOString().split('T')[0];
    }

    const partesFecha = targetDateStr.split('-');
    if (partesFecha.length !== 3) {
      return res.status(400).json({ message: 'Formato de fecha inválido. Debe ser YYYY-MM-DD.' });
    }

    const startOfDay = new Date(Date.UTC(
      parseInt(partesFecha[0], 10),
      parseInt(partesFecha[1], 10) - 1,
      parseInt(partesFecha[2], 10),
      0, 0, 0, 0
    ));

    const endOfDay = new Date(Date.UTC(
      parseInt(partesFecha[0], 10),
      parseInt(partesFecha[1], 10) - 1,
      parseInt(partesFecha[2], 10),
      23, 59, 59, 999
    ));

    // Buscar todas las reservas del día sin filtrar por estado
    const reservas = await Reserva.find({
      fecha_reserva: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ hora_reserva: 1 });

    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener todas las reservas del día:', error);
    res.status(500).json({ message: 'Error al consultar las reservas.' });
  }
};

exports.obtenerOcupacionPorHora = async (req, res) => {
  const { fecha } = req.query;

  try {
    if (!fecha) {
      return res.status(400).json({ message: 'La fecha es requerida (formato YYYY-MM-DD).' });
    }

    const partesFecha = fecha.split('-');
    if (partesFecha.length !== 3) {
      return res.status(400).json({ message: 'Formato de fecha inválido. Debe ser YYYY-MM-DD.' });
    }

    const startOfDay = new Date(Date.UTC(
      parseInt(partesFecha[0], 10),
      parseInt(partesFecha[1], 10) - 1,
      parseInt(partesFecha[2], 10),
      0, 0, 0, 0
    ));

    const endOfDay = new Date(Date.UTC(
      parseInt(partesFecha[0], 10),
      parseInt(partesFecha[1], 10) - 1,
      parseInt(partesFecha[2], 10),
      23, 59, 59, 999
    ));

    const ocupacion = await Reserva.aggregate([
      {
        $match: {
          fecha_reserva: {
            $gte: startOfDay,
            $lte: endOfDay
          },
          estado: { $ne: 'cancelada' }
        }
      },
      {
        $group: {
          _id: '$hora_reserva',
          total_personas: { $sum: '$cantidad_personas' },
          total_reservas: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const resultado = ocupacion.map(item => ({
      hora: item._id,
      total_personas: item.total_personas,
      total_reservas: item.total_reservas
    }));

    res.status(200).json(resultado);
  } catch (error) {
    console.error('Error en agregación de ocupación por hora:', error);
    res.status(500).json({ message: 'Error al calcular la ocupación por hora.' });
  }
};

exports.obtenerActividadReciente = async (req, res) => {
  try {
    const logs = await AuditoriaLog.find({})
      .sort({ fecha: -1 })
      .limit(20);

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error al obtener log de auditoría:', error);
    res.status(500).json({ message: 'Error al obtener la actividad de auditoría reciente.' });
  }
};
