const pool = require('../config/db');

const obtenerMedallasPorUsuario = async (req, res) => {
    try {
        const { id_user } = req.params;
        const result = await pool.query(
            'SELECT * FROM medallas_usuario WHERE id_user = $1 ORDER BY fecha_obtencion ASC',
            [id_user]
        );
        return res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener medallas:', error);
        return res.status(500).json({ error: 'Error al consultar medallas' });
    }
};

const desbloquearMedalla = async (req, res) => {
    try {
        const { id_user, materia, numero_leccion, id_pokemon, nombre_pokemon } = req.body;

        if (!id_user || !materia || !numero_leccion || !id_pokemon || !nombre_pokemon) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const result = await pool.query(
            `INSERT INTO medallas_usuario (id_user, materia, numero_leccion, id_pokemon, nombre_pokemon)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id_user, id_pokemon) DO NOTHING
             RETURNING *`,
            [id_user, materia, numero_leccion, id_pokemon, nombre_pokemon]
        );

        if (result.rows.length === 0) {
            return res.status(200).json({ nueva: false, mensaje: 'Medalla ya obtenida previamente' });
        }

        return res.status(201).json({ nueva: true, medalla: result.rows[0] });
    } catch (error) {
        console.error('Error al desbloquear medalla:', error);
        return res.status(500).json({ error: 'No se pudo registrar la medalla' });
    }
};

module.exports = { obtenerMedallasPorUsuario,desbloquearMedalla };