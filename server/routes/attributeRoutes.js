const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Получить все атрибуты и их уникальные значения
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT a.slug AS attribute_slug, a.name AS attribute_name, array_agg(DISTINCT av.value) AS values
      FROM attributes a
      JOIN attribute_values av ON a.id = av.attribute_id
      GROUP BY a.id
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;