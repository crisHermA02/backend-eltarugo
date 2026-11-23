const express = require('express');
const enrutador = express.Router();
const controladorUsuarios = require('../controllers/usuario.controller');

const { verificarToken, esAdmin, esMismoUsuarioOAdmin } = require('../middlewares/auth.middleware');

enrutador.get('/', verificarToken, esAdmin, controladorUsuarios.listarUsuarios);
enrutador.put('/:id', verificarToken, esMismoUsuarioOAdmin, controladorUsuarios.modificarUsuario);
enrutador.delete('/:id', verificarToken, esMismoUsuarioOAdmin, controladorUsuarios.eliminarUsuario);
enrutador.post('/', verificarToken, esAdmin, controladorUsuarios.crearUsuario);
module.exports = enrutador;