const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta pública para crear reserva
router.post('/', reservaController.crearReserva);

// Ruta protegida para actualizar el estado de la reserva
router.patch('/:id', authMiddleware, reservaController.actualizarEstadoReserva);

module.exports = router;
