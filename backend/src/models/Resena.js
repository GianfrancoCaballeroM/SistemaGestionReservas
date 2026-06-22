const mongoose = require('mongoose');

const ResenaSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
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
  },
  estado: {
    type: String,
    enum: ['aprobada', 'oculta'],
    default: 'oculta',
    required: true
  }
}, {
  timestamps: true
});

// Índice compuesto para consultas eficientes en la landing page
ResenaSchema.index({ estado: 1, fecha: -1 });

module.exports = mongoose.model('Resena', ResenaSchema, 'resenas');
