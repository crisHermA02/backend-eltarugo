const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ mensaje: 'No se proporcionó un token de autenticación' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro', (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token inválido o expirado' });
        }
        req.usuario = decoded; 
        next();
    });
};

const esAdmin = (req, res, next) => {
    const rol = req.usuario.id_rol || req.usuario.rol;
    
    if (rol === 1 || rol === 'Administrador') {
        next();
    } else {
        return res.status(403).json({ mensaje: 'Acceso denegado: Se requiere rol de Administrador' });
    }
};

const esMismoUsuarioOAdmin = (req, res, next) => {
    const idSolicitado = parseInt(req.params.id);
    const rol = req.usuario.id_rol || req.usuario.rol;
    const esAdministrador = (rol === 1 || rol === 'Administrador');

    if (!esAdministrador && req.usuario.id_user !== idSolicitado) {
        return res.status(403).json({ mensaje: 'No tienes permiso para acceder o modificar los datos de otro usuario' });
    }
    next();
};

module.exports = { verificarToken, esAdmin, esMismoUsuarioOAdmin };