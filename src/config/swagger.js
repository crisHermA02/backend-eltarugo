const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API Ferretería El Tarugo',
    version: '1.0.0',
    description: 'Endpoints de autenticación y gestión de usuarios',
  },
  servers: [
    { url: 'http://44.218.174.107:3000/api', description: 'Servidor EC2' },
    { url: 'http://localhost:3000/api', description: 'Local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión y obtener token JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'contrasena'],
                properties: {
                  email: { type: 'string', example: 'usuarioswagger@test.cl' },
                  contrasena: { type: 'string', example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login exitoso (devuelve token)' },
          401: { description: 'Credenciales inválidas' },
        },
      },
    },
    '/auth/registro': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar un nuevo usuario cliente (con contraseña)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre_user', 'email', 'contrasena', 'id_rol'],
                properties: {
                  nombre_user: { type: 'string', example: 'Juan Pérez' },
                  email: { type: 'string', example: 'juan@email.cl' },
                  contrasena: { type: 'string', example: '123456' },
                  rut_user: { type: 'string', example: '12.345.678-9' },
                  telefono_user: { type: 'string', example: '+56912345678' },
                  id_rol: { type: 'integer', example: 2 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuario registrado exitosamente (contraseña hasheada con bcrypt)' },
          400: { description: 'Datos inválidos o correo ya registrado' },
        },
      },
    },
    '/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Obtener todos los usuarios',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Lista de usuarios' },
          401: { description: 'No autorizado' },
        },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear un nuevo usuario',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre_user', 'email', 'id_rol'],
                properties: {
                  nombre_user: { type: 'string', example: 'Raúl Cuevas' },
                  email: { type: 'string', example: 'raucuevas@cuevamail.cl' },
                  rut_user: { type: 'string', example: '8.337.523-4' },
                  telefono_user: { type: 'string', example: '+56912345678' },
                  id_rol: { type: 'integer', example: 2 },
                  direccion: { type: 'string', example: 'Los Montes, 1232, Lo Carro' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Usuario creado' },
          400: { description: 'Error en los datos enviados' },
        },
      },
    },
    '/usuarios/{id}': {
      put: {
        tags: ['Usuarios'],
        summary: 'Actualizar usuario por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nombre_user: { type: 'string' },
                  email: { type: 'string' },
                  rut_user: { type: 'string' },
                  telefono_user: { type: 'string' },
                  id_rol: { type: 'integer' },
                  direccion: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Usuario actualizado' },
          404: { description: 'Usuario no encontrado' },
        },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Eliminar usuario por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: {
          200: { description: 'Usuario eliminado' },
          404: { description: 'Usuario no encontrado' },
        },
      },
    },
  },
};

module.exports = swaggerDocument;