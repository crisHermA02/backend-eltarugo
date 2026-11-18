const express = require('express');
const cors = require('cors');

const rutasAuth = require('./routes/auth.routes');
const rutasUsuarios = require('./routes/usuario.routes');

const aplicacion = express();
aplicacion.use(cors());
aplicacion.use(express.json());

// Montaje de rutas
aplicacion.use('/api/auth', rutasAuth);
aplicacion.use('/api', rutasUsuarios);

aplicacion.use((peticion, respuesta) => respuesta.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = aplicacion;