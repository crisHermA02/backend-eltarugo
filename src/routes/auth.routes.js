const express = require('express');
const enrutador = express.Router();
const controladorAuth = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

enrutador.post('/registro', controladorAuth.registrarUsuario);
enrutador.post('/login', controladorAuth.iniciarSesion);
enrutador.get('/me', verificarToken, controladorAuth.obtenerSesion);

module.exports = enrutador;