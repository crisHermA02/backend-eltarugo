const grupoConexiones = require('../config/db');

async function listarUsuarios(peticion, respuesta) {
    try {
        const consultaSql = 'SELECT id_user, email, nombre_user, rut_user, telefono_user, id_rol FROM users ORDER BY id_user ASC';
        const resultado = await grupoConexiones.query(consultaSql);
        respuesta.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Error al listar usuarios:', error.message);
        respuesta.status(500).json({ error: 'Error interno al consultar los usuarios' });
    }
}

async function modificarUsuario(peticion, respuesta) {
    const { id } = peticion.params;
    const { nombre_user, telefono_user } = peticion.body;

    try {
        const consultaSql = `
            UPDATE users 
            SET nombre_user = $1, telefono_user = $2 
            WHERE id_user = $3 
            RETURNING id_user, nombre_user, telefono_user;
        `;
        const resultado = await grupoConexiones.query(consultaSql, [nombre_user, telefono_user, id]);
        
        if (resultado.rows.length === 0) {
            return respuesta.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        respuesta.status(200).json({ mensaje: 'Usuario actualizado', usuario: resultado.rows[0] });
    } catch (error) {
        console.error('Error al modificar usuario:', error.message);
        respuesta.status(500).json({ error: 'Error interno al modificar el usuario' });
    }
}

async function eliminarUsuario(peticion, respuesta) {
    const { id } = peticion.params;

    try {
        const consultaSql = 'DELETE FROM users WHERE id_user = $1 RETURNING id_user';
        const resultado = await grupoConexiones.query(consultaSql, [id]);

        if (resultado.rows.length === 0) {
            return respuesta.status(404).json({ error: 'Usuario no encontrado' });
        }

        respuesta.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        respuesta.status(500).json({ error: 'Error interno al eliminar el usuario' });
    }
}

module.exports = { listarUsuarios, modificarUsuario, eliminarUsuario };