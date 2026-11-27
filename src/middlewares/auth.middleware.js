const jwt = require('jsonwebtoken');
const grupoConexiones = require('../config/db');

const ROL_ADMIN = 1;

const verificarToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensaje: 'No se proporcionó un token de autenticación' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }

    try {
        const { rows } = await grupoConexiones.query(
            'SELECT id_user, email, nombre_user, id_rol FROM users WHERE id_user = $1',
            [decoded.id_user]
        );

        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'La sesión ya no es válida' });
        }

        req.usuario = {
            id_user: rows[0].id_user,
            email: rows[0].email,
            nombre: rows[0].nombre_user,
            id_rol: rows[0].id_rol
        };
        next();
    } catch (error) {
        console.error('Error al revalidar la sesión:', error.message);
        return res.status(500).json({ mensaje: 'Error interno al validar la sesión' });
    }
};

const esAdmin = (req, res, next) => {
    if (Number(req.usuario.id_rol) === ROL_ADMIN) {
        return next();
    }
    return res.status(403).json({ mensaje: 'Acceso denegado: Se requiere rol de Administrador' });
};

const esMismoUsuarioOAdmin = (req, res, next) => {
    const idSolicitado = parseInt(req.params.id, 10);
    const esAdministrador = Number(req.usuario.id_rol) === ROL_ADMIN;

    if (!esAdministrador && Number(req.usuario.id_user) !== idSolicitado) {
        return res.status(403).json({ mensaje: 'No tienes permiso para acceder o modificar los datos de otro usuario' });
    }
    next();
};

module.exports = { verificarToken, esAdmin, esMismoUsuarioOAdmin };