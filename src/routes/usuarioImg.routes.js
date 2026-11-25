const express = require('express');
const router = express.Router();
const { guardarImagen, obtenerImagen } = require('../controllers/usuarioImg.controller');

router.post('/', guardarImagen);
router.get('/:id_user', obtenerImagen);

module.exports = router;