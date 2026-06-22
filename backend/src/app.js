const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const menuRoutes = require('./routes/menuRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const resenaRoutes = require('./routes/resenaRoutes');
const campanaRoutes = require('./routes/campanaRoutes'); // NUEVO

// Registrar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/campanas', campanaRoutes); // NUEVO

// Ruta de estado de salud de la API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta de API no encontrada.' });
});

module.exports = app;
