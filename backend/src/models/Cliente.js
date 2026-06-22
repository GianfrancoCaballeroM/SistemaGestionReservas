const mongoose = require('mongoose');

const NotaStaffSchema = new mongoose.Schema({
  autor: {
    type: String,
    required: true,
    trim: true
  },
  comentario: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  }
});

const ClienteSchema = new mongoose.Schema({
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
    lowercase: true,
    index: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  preferencias: {
    type: [String],
    default: []
  },
  total_reservas_historicas: {
    type: Number,
    default: 0,
    index: -1
  },
  notas_staff: {
    type: [NotaStaffSchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cliente', ClienteSchema, 'clientes');
