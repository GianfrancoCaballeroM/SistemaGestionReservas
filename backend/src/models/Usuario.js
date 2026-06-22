const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre_completo: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  password_hash: {
    type: String,
    required: true,
    select: false
  },
  rol: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'staff',
    required: true
  },
  ultimo_acceso: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios');
