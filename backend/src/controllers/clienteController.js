const Cliente = require('../models/Cliente');

exports.obtenerClientes = async (req, res) => {
  const { count } = req.query;

  try {
    if (count === 'true') {
      const totalClientes = await Cliente.countDocuments({});
      return res.status(200).json({ total: totalClientes });
    }

    const clientes = await Cliente.find({}).sort({ total_reservas_historicas: -1 });
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener la lista de clientes del CRM.' });
  }
};

exports.agregarNota = async (req, res) => {
  const { id } = req.params;
  const { comentario } = req.body;
  const autor = req.user ? req.user.username : 'staff_anonimo';

  try {
    if (!comentario || comentario.trim() === '') {
      return res.status(400).json({ message: 'El comentario de la nota es requerido.' });
    }

    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    // Agregar la nota al subdocumento
    cliente.notas_staff.push({
      autor,
      comentario: comentario.trim(),
      fecha: new Date()
    });

    await cliente.save();

    res.status(201).json({
      message: 'Nota agregada con éxito.',
      cliente
    });
  } catch (error) {
    console.error('Error al agregar nota al cliente:', error);
    res.status(500).json({ message: 'Error interno al guardar la nota.' });
  }
};

exports.eliminarNota = async (req, res) => {
  const { id, notaId } = req.params;

  try {
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado.' });
    }

    // Remover la nota del array de Mongoose
    cliente.notas_staff.pull({ _id: notaId });
    await cliente.save();

    res.status(200).json({
      message: 'Nota eliminada con éxito.',
      cliente
    });
  } catch (error) {
    console.error('Error al eliminar nota del cliente:', error);
    res.status(500).json({ message: 'Error interno al remover la nota.' });
  }
};
