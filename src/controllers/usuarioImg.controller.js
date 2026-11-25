const pool = require('../config/db');

const guardarImagen = async (peticion, respuesta) => {
  const { id_user, imagen_base64, mime_type } = peticion.body;
  if (!id_user || !imagen_base64) {
    return respuesta.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    const query = `
      INSERT INTO user_img (id_user, imagen_base64, mime_type, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (id_user)
      DO UPDATE SET
        imagen_base64 = EXCLUDED.imagen_base64,
        mime_type = EXCLUDED.mime_type,
        updated_at = NOW()
      RETURNING id_img, id_user, updated_at;
    `;
    const resultado = await pool.query(query, [id_user, imagen_base64, mime_type || 'image/jpeg']);
    return respuesta.status(200).json({ mensaje: 'Imagen guardada', data: resultado.rows[0] });
  } catch (error) {
    console.error(error);
    return respuesta.status(500).json({ error: 'Error al guardar la imagen' });
  }
};

const obtenerImagen = async (peticion, respuesta) => {
  const { id_user } = peticion.params;

  try {
    const resultado = await pool.query(
      'SELECT id_user, imagen_base64, mime_type FROM user_img WHERE id_user = $1',
      [id_user]
    );
    if (resultado.rows.length === 0) {
      return respuesta.status(404).json({ mensaje: 'Usuario sin foto de perfil' });
    }
    return respuesta.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);
    return respuesta.status(500).json({ error: 'Error al obtener la imagen' });
  }
};

module.exports = { guardarImagen, obtenerImagen };