const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const rutasAuth = require('./routes/auth.routes');
const rutasUsuarios = require('./routes/usuario.routes');
const rutasMedallas = require('./routes/medallas.routes');
const rutasUserImg = require('./routes/usuarioImg.routes');
const swaggerDocument = require('./config/swagger');

const aplicacion = express();
aplicacion.use(cors());
aplicacion.use(express.json({ limit: '5mb' }));
aplicacion.use('/api/auth', rutasAuth);
aplicacion.use('/api/usuarios', rutasUsuarios);
aplicacion.use('/api/medallas', rutasMedallas);
aplicacion.use('/api/user-img', rutasUserImg);
aplicacion.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
aplicacion.use((peticion, respuesta) => respuesta.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = aplicacion;