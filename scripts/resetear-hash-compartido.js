// detecta usuarios que comparten el mismo hash de contraseña (por ejemplo, los
// creados antes con HASH_DEFAULT) y les asigna una clave temporal distinta.
//
// uso:
//   node scripts/resetear-hash-compartido.js: solo lista (no cambia nada)
//   node scripts/resetear-hash-compartido.js --aplicar: cambia las claves
//
// con --aplicar imprime cada clave temporal UNA sola vez, hay que entregarsela a
// cada usuario, porque despues solo queda guardado su hash
require('dotenv').config();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const grupoConexiones = require('../src/config/db');

async function main() {
    const aplicar = process.argv.includes('--aplicar');
    const hashDefecto = process.env.HASH_DEFAULT || null;

    const { rows } = await grupoConexiones.query(
        `SELECT id_user, email FROM users
         WHERE hash_contrasena IN (
                 SELECT hash_contrasena FROM users GROUP BY hash_contrasena HAVING COUNT(*) > 1
               )
            OR hash_contrasena = $1
         ORDER BY id_user`,
        [hashDefecto]
    );

    if (rows.length === 0) {
        console.log('No hay usuarios que compartan hash de contraseña.');
        return;
    }

    console.log(`Usuarios con hash compartido: ${rows.length}`);
    if (!aplicar) {
        console.table(rows);
        console.log('Modo simulación. Ejecuta con --aplicar para asignarles una clave temporal.');
        return;
    }

    const entregar = [];
    for (const { id_user, email } of rows) {
        const clave = crypto.randomBytes(9).toString('base64url');
        const hash = await bcrypt.hash(clave, 10);
        await grupoConexiones.query('UPDATE users SET hash_contrasena = $1 WHERE id_user = $2', [hash, id_user]);
        entregar.push({ id_user, email, clave_temporal: clave });
    }
    console.table(entregar);
}

main()
    .catch((error) => { console.error('Error:', error.message); process.exitCode = 1; })
    .finally(() => grupoConexiones.end());
