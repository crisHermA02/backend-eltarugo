const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const grupoConexiones = require('../config/db');

async function registrarUsuario(peticion, respuesta) {
    const { email, nombre_user, contrasena, rut_user, telefono_user, id_rol } = peticion.body;

    try {
        const rondasSal = 10;
        const hashContrasena = await bcrypt.hash(contrasena, rondasSal);

        const consultaSql = `
            INSERT INTO users (email, nombre_user, hash_contrasena, rut_user, telefono_user, id_rol)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_user, email, nombre_user;
        `;
        
        const resultado = await grupoConexiones.query(consultaSql, [
            email, nombre_user, hashContrasena, rut_user, telefono_user, id_rol
        ]);

        respuesta.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: resultado.rows[0] });
    } catch (error) {
        console.error('Error en registro:', error.message);
        if (error.code === '23505') {
            return respuesta.status(409).json({ error: 'El correo o RUT ya se encuentran registrados' });
        }
        respuesta.status(500).json({ error: 'Error interno al registrar usuario' });
    }
}

async function iniciarSesion(peticion, respuesta) {
    const { email, contrasena } = peticion.body;

    if (!email || !contrasena) {
        return respuesta.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    try {
        const resultado = await grupoConexiones.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (resultado.rows.length === 0) {
            return respuesta.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = resultado.rows[0];
        const claveValida = await bcrypt.compare(contrasena, usuario.hash_contrasena);
        
        if (!claveValida) {
            return respuesta.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id_user: usuario.id_user, id_rol: usuario.id_rol, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        respuesta.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso', 
            token,
            usuario: {
                id_user: usuario.id_user,
                nombre: usuario.nombre_user,
                rol: usuario.id_rol
            }
        });

    } catch (error) {
        console.error('Error en inicio de sesión:', error.message);
        respuesta.status(500).json({ error: 'Error interno durante el inicio de sesión' });
    }
}

module.exports = { registrarUsuario, iniciarSesion };