const express = require('express');
const router = express.Router();
const campanaController = require('../controllers/campanaController');
const authMiddleware = require('../middleware/authMiddleware');

// Proteger todas las rutas de campañas
router.use(authMiddleware);

router.get('/', campanaController.obtenerCampanas);
router.post('/', campanaController.crearCampana);

module.exports = router;
