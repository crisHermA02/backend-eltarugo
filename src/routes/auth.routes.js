const express = require('express');
const enrutador = express.Router();
const controladorAuth = require('../controllers/auth.controller');

enrutador.post('/registro', controladorAuth.registrarUsuario);
enrutador.post('/login', controladorAuth.iniciarSesion);

module.exports = enrutador;