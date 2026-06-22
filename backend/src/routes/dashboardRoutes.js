const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas del dashboard
router.use(authMiddleware);

router.get('/reservas-hoy', dashboardController.obtenerReservasHoy);
router.get('/reservas', dashboardController.obtenerTodasReservas); // NUEVO
router.get('/ocupacion-por-hora', dashboardController.obtenerOcupacionPorHora);
router.get('/actividad', dashboardController.obtenerActividadReciente);

module.exports = router;
