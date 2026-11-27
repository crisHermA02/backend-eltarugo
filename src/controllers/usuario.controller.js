const bcrypt = require('bcrypt');
const crypto = require('crypto');
const grupoConexiones = require('../config/db');

const RONDAS_SAL = 10;
const LARGO_MINIMO_CLAVE = 6;
const ROL_ADMIN = 1;
const ROL_CLIENTE = 2;

const ROLES_POR_NOMBRE = { Administrador: 1, Cliente: 2, Contratista: 3 };
const ROLES_VALIDOS = Object.values(ROLES_POR_NOMBRE);
const COLUMNAS_PUBLICAS = 'id_user, email, nombre_user, rut_user, telefono_user, id_rol';

function interpretarRol(valor) {
    const numero = Number(valor);
    if (!Number.isNaN(numero) && ROLES_VALIDOS.includes(numero)) return numero;
    return ROLES_POR_NOMBRE[valor] ?? null;
}

function generarClaveTemporal() {
    return crypto.randomBytes(9).toString('base64url');
}

async function guardarDireccion(idUser, direccion) {
    const partes = direccion.split(',').map((parte) => parte.trim());
    const alias = partes[0] || 'Principal';
    const numero_calle = partes[1] || '';
    const comuna = partes[2] || '';
    const codigo_postal = partes[3] || '';

    await grupoConexiones.query(
        `INSERT INTO Direccion (id_user, alias, numero_calle, comuna, codigo_postal)
         VALUES ($1, $2, $3, $4, $5)`,
        [idUser, alias, numero_calle, comuna, codigo_postal]
    );
}

async function listarUsuarios(peticion, respuesta) {
    try {
        const consultaSql = `
            SELECT ${COLUMNAS_PUBLICAS}
            FROM users
            WHERE id_rol IN (1, 2, 3)
            ORDER BY id_user ASC
        `;
        const resultado = await grupoConexiones.query(consultaSql);
        respuesta.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al listar usuarios:', error.message);
        respuesta.status(500).json({ error: 'Error interno al consultar los usuarios' });
    }
}

const crearUsuario = async (req, res) => {
    try {
        const nombre_user = req.body.nombre_user || req.body.nombre;
        const email = req.body.email || req.body.correo;
        const rut_user = req.body.rut_user || req.body.rut;
        const telefono_user = req.body.telefono_user || req.body.telefono || 'Sin teléfono';
        const direccion_user = req.body.direccion_user || req.body.direccion;

        if (!nombre_user || !email || !rut_user) {
            return res.status(400).json({ mensaje: 'Nombre, correo y RUT son obligatorios' });
        }

        const rolRecibido = req.body.id_rol || req.body.rol;
        const id_rol = rolRecibido ? interpretarRol(rolRecibido) : ROL_CLIENTE;
        if (id_rol === null) {
            return res.status(400).json({ mensaje: 'El rol indicado no es válido' });
        }

        const claveEnviada = req.body.contrasena;
        if (claveEnviada !== undefined && String(claveEnviada).length < LARGO_MINIMO_CLAVE) {
            return res.status(400).json({ mensaje: `La contraseña debe tener al menos ${LARGO_MINIMO_CLAVE} caracteres` });
        }
        const claveInicial = claveEnviada !== undefined ? String(claveEnviada) : generarClaveTemporal();
        const hashContrasena = await bcrypt.hash(claveInicial, RONDAS_SAL);

        const resultadoUser = await grupoConexiones.query(
            `INSERT INTO users (email, nombre_user, hash_contrasena, rut_user, telefono_user, fecha_registro, id_rol)
             VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6)
             RETURNING ${COLUMNAS_PUBLICAS}`,
            [email.trim(), nombre_user.trim(), hashContrasena, rut_user.trim(), telefono_user.trim(), id_rol]
        );
        const nuevoUsuario = resultadoUser.rows[0];

        if (direccion_user && direccion_user.trim() !== '') {
            await guardarDireccion(nuevoUsuario.id_user, direccion_user);
        }

        const cuerpo = { mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario };
        // La clave temporal se muestra UNA sola vez, solo cuando la genero el servidor.
        if (claveEnviada === undefined) cuerpo.contrasena_temporal = claveInicial;

        res.status(201).json(cuerpo);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        if (error.code === '23505') {
            const campo = error.constraint?.includes('rut') ? 'RUT' : 'correo electrónico';
            return res.status(400).json({ mensaje: `El ${campo} ya se encuentra registrado` });
        }
        res.status(500).json({ error: 'Error interno del servidor al crear usuario' });
    }
};

const modificarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const nombre_user = req.body.nombre_user || req.body.nombre || null;
        const email = req.body.email || req.body.correo || null;
        const telefono_user = req.body.telefono_user || req.body.telefono || null;
        const direccion_user = req.body.direccion_user || req.body.direccion;
        const rolRecibido = req.body.id_rol || req.body.rol;

        let id_rol = null;
        if (rolRecibido) {
            if (Number(req.usuario.id_rol) !== ROL_ADMIN) {
                return res.status(403).json({ mensaje: 'Solo un administrador puede cambiar roles' });
            }
            id_rol = interpretarRol(rolRecibido);
            if (id_rol === null) {
                return res.status(400).json({ mensaje: 'El rol indicado no es válido' });
            }
        }

        const resultadoUser = await grupoConexiones.query(
            `UPDATE users
             SET nombre_user = COALESCE($1, nombre_user),
                 email = COALESCE($2, email),
                 telefono_user = COALESCE($3, telefono_user),
                 id_rol = COALESCE($4, id_rol)
             WHERE id_user = $5
             RETURNING ${COLUMNAS_PUBLICAS}`,
            [nombre_user, email, telefono_user, id_rol, id]
        );

        if (resultadoUser.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (direccion_user && direccion_user.trim() !== '') {
            await guardarDireccion(id, direccion_user);
        }

        res.json({
            mensaje: 'Usuario actualizado exitosamente',
            usuario: resultadoUser.rows[0]
        });
    } catch (error) {
        console.error('Error al modificar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar' });
    }
};

async function eliminarUsuario(peticion, respuesta) {
    const { id } = peticion.params;
    const cliente = await grupoConexiones.connect();
    try {
        await cliente.query('BEGIN');
        await cliente.query('DELETE FROM Direccion WHERE id_user = $1', [id]);
        const resultado = await cliente.query('DELETE FROM users WHERE id_user = $1 RETURNING id_user', [id]);
        if (resultado.rows.length === 0) {
            await cliente.query('ROLLBACK');
            return respuesta.status(404).json({ error: 'Usuario no encontrado' });
        }
        await cliente.query('COMMIT');
        respuesta.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        await cliente.query('ROLLBACK');
        console.error('Error al eliminar usuario:', error.message);
        respuesta.status(500).json({ error: 'Error interno al eliminar el usuario' });
    } finally {
        cliente.release();
    }
}

module.exports = { listarUsuarios, crearUsuario, modificarUsuario, eliminarUsuario };