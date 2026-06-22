const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de clientes
router.use(authMiddleware);

router.get('/', clienteController.obtenerClientes);
router.post('/:id/notas', clienteController.agregarNota);
router.delete('/:id/notas/:notaId', clienteController.eliminarNota);

module.exports = router;
