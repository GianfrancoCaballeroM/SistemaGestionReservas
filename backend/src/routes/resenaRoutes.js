const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

router.get('/', resenaController.obtenerResenasAprobadas);

module.exports = router;
