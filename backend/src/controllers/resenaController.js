const Resena = require('../models/Resena');

exports.obtenerResenasAprobadas = async (req, res) => {
  try {
    const resenas = await Resena.find({ estado: 'aprobada' })
      .populate('cliente_id', 'nombre_completo') // Para poder mostrar el nombre del cliente si es necesario
      .sort({ createdAt: -1 }); // Mostrar las más recientes primero

    res.status(200).json(resenas);
  } catch (error) {
    console.error('Error al obtener reseñas aprobadas:', error);
    res.status(500).json({ message: 'Error al obtener las opiniones de los clientes.' });
  }
};
