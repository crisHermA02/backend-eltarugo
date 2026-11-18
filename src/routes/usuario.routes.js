const express = require('express');
const enrutador = express.Router();
const controladorUsuarios = require('../controllers/usuario.controller');

enrutador.get('/usuarios', controladorUsuarios.listarUsuarios);
enrutador.put('/usuarios/:id', controladorUsuarios.modificarUsuario);
enrutador.delete('/usuarios/:id', controladorUsuarios.eliminarUsuario);

module.exports = enrutador;