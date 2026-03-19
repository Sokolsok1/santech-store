const express = require('express')
const router = express.Router()
const pool = require('../config/db')

router.get('/', async (req, res) => {

  const { category, ...filters } = req.query

  let query = `
    SELECT DISTINCT p.*, pi.image_url AS image
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `

  const params = []
  let i = 1

  if (category) {
    query += ` AND c.slug = $${i}`
    params.push(category)
    i++
  }

  for (let key in filters) {

    query += `
      AND p.id IN (
        SELECT pa.product_id
        FROM product_attributes pa
        JOIN attributes a ON pa.attribute_id = a.id
        WHERE a.slug = $${i} AND pa.value = $${i+1}
      )
    `

    params.push(key, filters[key])
    i += 2
  }

  const result = await pool.query(query, params)

  res.json(result.rows)
})

module.exports = router