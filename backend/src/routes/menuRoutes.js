const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/authMiddleware');

// Ruta pública
router.get('/', menuController.obtenerMenu);

// Rutas protegidas para la gestión del menú (POST, PUT/PATCH, DELETE)
router.post('/', authMiddleware, menuController.crearMenuPlato);
router.put('/:id', authMiddleware, menuController.actualizarMenuPlato);
router.delete('/:id', authMiddleware, menuController.eliminarMenuPlato);

module.exports = router;
