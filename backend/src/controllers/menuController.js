const Menu = require('../models/Menu');

exports.obtenerMenu = async (req, res) => {
  try {
    // La landing page solo debe ver los platos disponibles
    const menu = await Menu.find({ disponible: true });
    res.status(200).json(menu);
  } catch (error) {
    console.error('Error al obtener menú:', error);
    res.status(500).json({ message: 'Error al obtener los platos del menú.' });
  }
};

exports.crearMenuPlato = async (req, res) => {
  const { nombre_plato, descripcion, precio, categoria, disponible } = req.body;

  try {
    if (!nombre_plato || !descripcion || precio === undefined || !categoria) {
      return res.status(400).json({ message: 'Por favor, proporcione todos los campos requeridos.' });
    }

    const nuevoPlato = new Menu({
      nombre_plato,
      descripcion,
      precio,
      categoria,
      disponible: disponible !== undefined ? disponible : true
    });

    await nuevoPlato.save();
    res.status(201).json(nuevoPlato);
  } catch (error) {
    console.error('Error al crear plato del menú:', error);
    res.status(500).json({ message: 'Error al agregar el plato al menú.' });
  }
};

exports.actualizarMenuPlato = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const plato = await Menu.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!plato) {
      return res.status(404).json({ message: 'Plato del menú no encontrado.' });
    }
    res.status(200).json(plato);
  } catch (error) {
    console.error('Error al actualizar plato del menú:', error);
    res.status(500).json({ message: 'Error al actualizar el plato del menú.' });
  }
};

exports.eliminarMenuPlato = async (req, res) => {
  const { id } = req.params;

  try {
    const plato = await Menu.findByIdAndDelete(id);
    if (!plato) {
      return res.status(404).json({ message: 'Plato del menú no encontrado.' });
    }
    res.status(200).json({ message: 'Plato del menú eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar plato del menú:', error);
    res.status(500).json({ message: 'Error al eliminar el plato del menú.' });
  }
};
