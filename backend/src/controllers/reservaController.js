const Reserva = require('../models/Reserva');
const Cliente = require('../models/Cliente');

exports.crearReserva = async (req, res) => {
  const { nombre, email, telefono, fecha_reserva, hora_reserva, cantidad_personas } = req.body;

  try {
    if (!nombre || !email || !telefono || !fecha_reserva || !hora_reserva || !cantidad_personas) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Convertir la fecha a formato ISO sin componente de hora local (UTC 00:00:00)
    // fecha_reserva vendrá en formato YYYY-MM-DD
    const partesFecha = fecha_reserva.split('-');
    if (partesFecha.length !== 3) {
      return res.status(400).json({ message: 'Formato de fecha inválido. Debe ser YYYY-MM-DD.' });
    }
    const fechaUTC = new Date(Date.UTC(
      parseInt(partesFecha[0], 10),
      parseInt(partesFecha[1], 10) - 1,
      parseInt(partesFecha[2], 10),
      0, 0, 0, 0
    ));

    // 1. Buscar si el cliente ya existe por email
    let cliente = await Cliente.findOne({ email: email.toLowerCase().trim() });

    if (!cliente) {
      // Crear nuevo cliente (CRM)
      cliente = new Cliente({
        nombre_completo: nombre.trim(),
        email: email.toLowerCase().trim(),
        telefono: telefono.trim(),
        preferencias: []
      });
      await cliente.save();
    } else {
      // Actualizar teléfono y nombre si es necesario
      cliente.nombre_completo = nombre.trim();
      cliente.telefono = telefono.trim();
      await cliente.save();
    }

    // 2. Crear la reserva
    const nuevaReserva = new Reserva({
      cliente_id: cliente._id,
      fecha_reserva: fechaUTC,
      hora_reserva: hora_reserva.trim(),
      cantidad_personas: parseInt(cantidad_personas, 10),
      estado: 'pendiente', // Por defecto, se crea como pendiente
      datos_contacto: {
        nombre: nombre.trim(),
        telefono: telefono.trim()
      }
    });

    await nuevaReserva.save();

    res.status(201).json({
      message: 'Reserva creada con éxito y enviada a revisión.',
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ message: 'Error interno del servidor al procesar la reserva.' });
  }
};

exports.actualizarEstadoReserva = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    if (!estado || !['pendiente', 'confirmada', 'cancelada'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido. Debe ser pendiente, confirmada o cancelada.' });
    }

    // CRÍTICO: Usar { new: true } para que el middleware post('findOneAndUpdate')
    // en el modelo Reserva reciba el documento actualizado con el nuevo estado
    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!reservaActualizada) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    res.status(200).json({
      message: `Reserva cambiada a estado: ${estado}`,
      reserva: reservaActualizada
    });
  } catch (error) {
    console.error('Error al cambiar estado de reserva:', error);
    res.status(500).json({ message: 'Error interno al actualizar el estado de la reserva.' });
  }
};
