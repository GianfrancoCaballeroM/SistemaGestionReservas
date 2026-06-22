const Usuario = require('../models/Usuario');
const AuditoriaLog = require('../models/AuditoriaLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Por favor, ingrese todos los campos.' });
    }

    const usuario = await Usuario.findOne({ username }).select('+password_hash');
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const esPasswordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!esPasswordValido) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Actualizar fecha de último acceso
    usuario.ultimo_acceso = new Date();
    await usuario.save();

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, username: usuario.username, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto_temporal',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Registrar log de auditoría
    await AuditoriaLog.create({
      accion: 'LOGIN_EXITOSO',
      entidad_id: usuario._id,
      detalles: `El usuario "${usuario.username}" inició sesión con rol: ${usuario.rol.toUpperCase()}`,
      fecha: new Date()
    });

    res.status(200).json({
      token,
      usuario: {
        id: usuario._id,
        username: usuario.username,
        rol: usuario.rol,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
