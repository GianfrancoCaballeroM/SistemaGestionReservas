const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  fecha_reserva: {
    type: Date,
    required: true
  },
  hora_reserva: {
    type: String,
    required: true,
    trim: true
  },
  cantidad_personas: {
    type: Number,
    required: true,
    min: 1
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente',
    required: true
  },
  datos_contacto: {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    telefono: {
      type: String,
      required: true,
      trim: true
    }
  },
  creado_en: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices optimizados
ReservaSchema.index({ fecha_reserva: 1, estado: 1 });
ReservaSchema.index({ hora_reserva: 1 });

// Middleware post('save') - Trigger doble
ReservaSchema.post('save', async function (doc) {
  try {
    const Cliente = mongoose.model('Cliente');
    const AuditoriaLog = mongoose.model('AuditoriaLog');

    // 1. Incrementar el contador histórico en Clientes
    if (doc.cliente_id) {
      await Cliente.findByIdAndUpdate(doc.cliente_id, {
        $inc: { total_reservas_historicas: 1 }
      });
    }

    // 2. Insertar log de auditoría
    const fechaFormateada = doc.fecha_reserva instanceof Date 
      ? doc.fecha_reserva.toISOString().split('T')[0] 
      : doc.fecha_reserva;

    await AuditoriaLog.create({
      accion: 'RESERVA_CREADA',
      entidad_id: doc._id,
      detalles: `Nueva reserva creada para ${doc.datos_contacto.nombre} (${doc.cantidad_personas} personas) el ${fechaFormateada} a las ${doc.hora_reserva}`,
      fecha: new Date()
    });
  } catch (err) {
    console.error('[Middleware Reserva post-save] Error:', err.message);
  }
});

// Middleware post('findOneAndUpdate') - Registrar cambios de estado
ReservaSchema.post('findOneAndUpdate', async function (doc) {
  try {
    if (!doc) return;
    const AuditoriaLog = mongoose.model('AuditoriaLog');
    const accion = doc.estado === 'cancelada' ? 'RESERVA_CANCELADA' : 'ESTADO_ACTUALIZADO';

    await AuditoriaLog.create({
      accion: accion,
      entidad_id: doc._id,
      detalles: `Reserva de ${doc.datos_contacto.nombre} cambiada a estado: ${doc.estado.toUpperCase()}`,
      fecha: new Date()
    });
  } catch (err) {
    console.error('[Middleware Reserva post-update] Error:', err.message);
  }
});

module.exports = mongoose.model('Reserva', ReservaSchema, 'reservas');
