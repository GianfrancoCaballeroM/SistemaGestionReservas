const mongoose = require('mongoose');

const CampanaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['whatsapp', 'email', 'sms'],
    required: true
  },
  asunto: {
    type: String,
    trim: true
  },
  mensaje: {
    type: String,
    required: true,
    trim: true
  },
  segmento_minimo_reservas: {
    type: Number,
    required: true,
    min: 0
  },
  total_destinatarios: {
    type: Number,
    required: true,
    default: 0
  },
  enviado_por: {
    type: String,
    required: true,
    trim: true
  },
  fecha_envio: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// Índice para el listado de campañas ordenado por fecha de envío
CampanaSchema.index({ fecha_envio: -1 });

module.exports = mongoose.model('Campana', CampanaSchema, 'campanas');
