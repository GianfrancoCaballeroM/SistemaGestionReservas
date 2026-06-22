const app = require('./src/app');
const connectDB = require('./src/config/db');

// Puerto de escucha
const PORT = process.env.PORT || 5000;

// Inicializar conexión a base de datos y arrancar servidor
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Arrancar servidor Express
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al arrancar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
