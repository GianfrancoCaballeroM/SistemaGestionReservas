const Usuario = require('../models/Usuario');
const AuditoriaLog = require('../models/AuditoriaLog');
const bcrypt = require('bcryptjs');

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios.' });
  }
};

exports.crearUsuario = async (req, res) => {
  const { nombre_completo, email, username, password, rol } = req.body;

  try {
    if (!nombre_completo || !email || !username || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Validar si el email ya existe
    const emailExiste = await Usuario.findOne({ email: email.toLowerCase().trim() });
    if (emailExiste) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Validar si el nombre de usuario ya existe
    const usuarioExiste = await Usuario.findOne({ username: username.trim() });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'El nombre de usuario ya está registrado.' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      nombre_completo: nombre_completo.trim(),
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password_hash,
      rol: rol || 'staff'
    });

    await nuevoUsuario.save();

    // Registrar log de auditoría
    await AuditoriaLog.create({
      accion: 'USUARIO_CREADO',
      entidad_id: nuevoUsuario._id,
      detalles: `Se creó el usuario de staff "${nuevoUsuario.username}" (${nuevoUsuario.nombre_completo}) con rol: ${nuevoUsuario.rol.toUpperCase()}`,
      fecha: new Date()
    });

    const usuarioCreado = nuevoUsuario.toObject();
    delete usuarioCreado.password_hash;

    res.status(201).json(usuarioCreado);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno al crear el usuario.' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user && req.user.id === id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta de administrador.' });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await Usuario.findByIdAndDelete(id);

    // Registrar log de auditoría
    await AuditoriaLog.create({
      accion: 'USUARIO_ELIMINADO',
      entidad_id: id,
      detalles: `Se eliminó al usuario "${usuario.username}" (${usuario.nombre_completo}) del sistema`,
      fecha: new Date()
    });

    res.status(200).json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno al eliminar el usuario.' });
  }
};

exports.cambiarPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    usuario.password_hash = password_hash;
    await usuario.save();

    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error interno al actualizar la contraseña.' });
  }
};
