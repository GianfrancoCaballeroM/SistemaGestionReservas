const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);

    const db = mongoose.connection;

    // Inicializar Capped Collection para auditoria_logs si no existe
    const collections = await db.db.listCollections({ name: 'auditoria_logs' }).toArray();
    if (collections.length === 0) {
      await db.db.createCollection('auditoria_logs', {
        capped: true,
        size: 1048576, // 1MB
        max: 1000      // Máximo 1000 documentos
      });
      console.log('Capped Collection "auditoria_logs" creada con éxito (1MB, max 1000 docs).');
    }

    // Crear o recrear la Vista nativa v_reservas_hoy de forma optimizada
    try {
      const pipeline = [
        {
          $match: {
            estado: "confirmada",
            $expr: {
              $and: [
                { $gte: [ "$fecha_reserva", { $dateTrunc: { date: "$$NOW", unit: "day" } } ] },
                { $lt: [ "$fecha_reserva", { $dateAdd: { startDate: { $dateTrunc: { date: "$$NOW", unit: "day" } }, unit: "day", amount: 1 } } ] }
              ]
            }
          }
        }
      ];

      // Verificamos si existe la vista antes de intentar crearla
      const views = await db.db.listCollections({ name: 'v_reservas_hoy' }).toArray();
      if (views.length === 0) {
        await db.db.createCollection('v_reservas_hoy', {
          viewOn: 'reservas',
          pipeline: pipeline
        });
        console.log('Vista "v_reservas_hoy" creada con éxito.');
      } else {
        console.log('La vista "v_reservas_hoy" ya existe.');
      }
    } catch (viewError) {
      // Manejar el código de error 48 en caso de colisión asíncrona
      if (viewError.code === 48) {
        console.log('La vista "v_reservas_hoy" ya existe (detectado por código 48).');
      } else {
        console.error('Error al configurar la vista "v_reservas_hoy":', viewError.message);
      }
    }

  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
