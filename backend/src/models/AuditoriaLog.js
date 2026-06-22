const mongoose = require('mongoose');

const AuditoriaLogSchema = new mongoose.Schema({
  accion: {
    type: String,
    enum: [
      'RESERVA_CREADA',
      'ESTADO_ACTUALIZADO',
      'RESERVA_CANCELADA',
      'USUARIO_CREADO',
      'USUARIO_ELIMINADO',
      'LOGIN_EXITOSO'
    ],
    required: true
  },
  entidad_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  detalles: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now,
    expires: 2592000 // TTL Index: 30 días
  }
});

// Índice para ordenar el feed de actividad de forma descendente
AuditoriaLogSchema.index({ fecha: -1 });

module.exports = mongoose.model('AuditoriaLog', AuditoriaLogSchema, 'auditoria_logs');
