## Backend de Web Ferreteria el tarugo

### Repo del frontend.
https://github.com/crisHermA02/Ferreteria-ElTarugo 

### Tablas implementadas actualmente
<img width="236" height="285" alt="{A35EDBE5-59C5-4368-9EA3-F526AFC8C2D8}" src="https://github.com/user-attachments/assets/22b78e12-c8f5-4e77-a1a2-d0525f10fb44" />

### Stack tecnologico:
- Node.js con express cors
- PostgreSQL
- npm
- bcrypt

### Estado del proyecto

| Estado | Módulo / Tarea | Descripción |
| :--- | :--- | :--- |
|  **Hecho** | Base de datos inicial (`Rol` y `User`) | Creación de tablas y relación de roles en PostgreSQL |
|  **Hecho** | Configuración del servidor | Express, CORS, manejo de JSON, ruta 404 y conexión con `pg` |
|  **Hecho** | Autenticación (`/api/auth`) | Registro con `bcrypt`, validación de duplicados y login con JWT |
|  **Hecho** | CRUD de usuarios (`/api/usuarios`) | Endpoints para listar (`GET`), actualizar (`PUT`) y eliminar (`DELETE`) |
|  **Hecho** | Conexión con el Frontend | Registro e inicio de sesión funcionando desde la web hacia la BD |
