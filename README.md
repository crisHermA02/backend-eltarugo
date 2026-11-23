## Backend de Web Ferreteria el tarugo

### Repo del frontend.
https://github.com/crisHermA02/Ferreteria-ElTarugo 

### Tablas implementadas actualmente en la base de datos
<img width="649" height="839" alt="{5FADF5FE-D50E-4268-BB7A-FED90C4CE683}" src="https://github.com/user-attachments/assets/9b82e968-cf13-4be9-9979-5ca8ee7ae211" />


### Stack tecnologico:
- Node.js con express cors
- PostgreSQL
- npm
- bcrypt
- swagger

### Estado del proyecto

| Estado | Módulo / Tarea | Descripción |
| :--- | :--- | :--- |
|  **Hecho** | Base de datos inicial (`Rol` y `User`) | Creación de tablas y relación de roles en PostgreSQL |
|  **Hecho** | Configuración del servidor | Express, CORS, manejo de JSON, ruta 404 y conexión con `pg` |
|  **Hecho** | Autenticación (`/api/auth`) | Registro con `bcrypt`, validación de duplicados y login con JWT |
|  **Hecho** | CRUD de usuarios (`/api/usuarios`) | Endpoints para listar (`GET`), actualizar (`PUT`) y eliminar (`DELETE`) |
|  **Hecho** | Conexión con el Frontend | Registro e inicio de sesión funcionando desde la web hacia la BD |
