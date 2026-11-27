require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET en el archivo .env. El servidor no puede iniciar.');
  process.exit(1);
}

const aplicacion = require('./src/app');
const PUERTO = process.env.PUERTO || process.env.PORT || 3000;

aplicacion.listen(PUERTO, '0.0.0.0', () => {
  console.log(`API Express lista y escuchando en el puerto ${PUERTO}`);
});