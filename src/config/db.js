const { Pool } = require('pg');

const grupoConexiones = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

grupoConexiones.query('SELECT NOW()')
    .then((respuesta) => console.log('Conectado a PostgreSQL local:', respuesta.rows[0].now))
    .catch((error) => console.error('Error conectando a PostgreSQL:', error.message));

module.exports = grupoConexiones;