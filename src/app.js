const express = require('express');
const cors = require('cors');

const rutasAuth = require('./routes/auth.routes');
const rutasUsuarios = require('./routes/usuario.routes');

const aplicacion = express();
aplicacion.use(cors());
aplicacion.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { 
            title: 'API El Tarugo', 
            version: '1.0.0',
            description: 'Documentación de la API de usuarios y autenticación'
        },
        servers: [{ url: process.env.URL_FRONTEND }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        }
    },
    apis: ['./src/routes/*.js'] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
aplicacion.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
aplicacion.use('/api/auth', rutasAuth);
aplicacion.use('/api/usuarios', rutasUsuarios);

aplicacion.use((peticion, respuesta) => respuesta.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = aplicacion;