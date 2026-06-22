const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas del CRUD de usuarios
router.use(authMiddleware);

router.get('/', usuarioController.obtenerUsuarios);
router.post('/', usuarioController.crearUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
router.patch('/:id/password', usuarioController.cambiarPassword);

module.exports = router;
