const express = require('express')
const router = express.Router()
const pool = require('../config/db')

router.get('/:categorySlug', async (req, res) => {

  const { categorySlug } = req.params

  const query = `
    SELECT 
      a.slug,
      a.name,
      pa.value
    FROM product_attributes pa
    JOIN attributes a ON a.id = pa.attribute_id
    JOIN products p ON p.id = pa.product_id
    JOIN categories c ON c.id = p.category_id
    WHERE c.slug = $1
  `

  const result = await pool.query(query, [categorySlug])

  const filters = {}

  result.rows.forEach(row => {

    if (!filters[row.slug]) {
      filters[row.slug] = {
        name: row.name,
        values: new Set()
      }
    }

    filters[row.slug].values.add(row.value)

  })

  const response = []

  for (let key in filters) {
    response.push({
      slug: key,
      name: filters[key].name,
      values: [...filters[key].values]
    })
  }

  res.json(response)

})

module.exports = router