const express = require('express');
const router = express.Router();
const { obtenerMedallasPorUsuario, desbloquearMedalla } = require('../controllers/medalla.controller');

router.get('/:id_user', obtenerMedallasPorUsuario);
router.post('/desbloquear', desbloquearMedalla);

module.exports = router;