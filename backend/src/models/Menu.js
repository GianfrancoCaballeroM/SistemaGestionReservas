const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  nombre_plato: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    enum: ['entradas', 'fondos', 'bebidas', 'postres'],
    required: true
  },
  disponible: {
    type: Boolean,
    default: true,
    required: true
  }
}, {
  timestamps: true
});

// Índice compuesto para consultas eficientes en la landing page
MenuSchema.index({ disponible: 1, categoria: 1 });

module.exports = mongoose.model('Menu', MenuSchema, 'menu');
