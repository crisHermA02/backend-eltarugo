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
- 
## Documentación API (Swagger)
La documentación interactiva de los endpoints de autenticación y usuarios está disponible en:
- **Producción (EC2):** http://44.218.174.107:3000/api-docs
- **Local:** http://localhost:3000/api-docs
<img width="1561" height="900" alt="{FCAA1C88-8894-4655-9F72-96D5F72E23A3}" src="https://github.com/user-attachments/assets/1c3faad4-53de-4fc1-b482-f68af003bfa2" />

### Estado del proyecto
| Estado | Módulo / Tarea | Descripción |
| :--- | :--- | :--- |
|  **Hecho** | Base de datos inicial (`Rol` y `User`) | Creación de tablas y relación de roles en PostgreSQL |
|  **Hecho** | Configuración del servidor | Express, CORS, manejo de JSON, ruta 404 y conexión con `pg` |
|  **Hecho** | Autenticación (`/api/auth`) | Registro con `bcrypt`, validación de duplicados y login con JWT |
|  **Hecho** | CRUD de usuarios (`/api/usuarios`) | Endpoints para listar (`GET`), actualizar (`PUT`) y eliminar (`DELETE`) |
|  **Hecho** | Conexión con el Frontend | Registro e inicio de sesión funcionando desde la web hacia la BD |
|  **Hecho** | Documentación con Swagger
