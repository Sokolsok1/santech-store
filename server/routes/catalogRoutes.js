const express = require('express')
const router = express.Router()
const pool = require('../config/db')

router.get('/', async (req, res) => {

  const { category, page = 1, limit = 6, sort = 'price_asc', ...filters } = req.query

  const offset = (page - 1) * limit

  let baseQuery = `
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `

  const params = []
  let i = 1

  // категория
  if (category) {
    baseQuery += ` AND c.slug = $${i}`
    params.push(category)
    i++
  }

  // фильтры
  for (let key in filters) {
    baseQuery += `
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

  // 🔥 СОРТИРОВКА
  let orderBy = 'p.price ASC'

  switch (sort) {
    case 'price_desc':
      orderBy = 'p.price DESC'
      break
    case 'name_asc':
      orderBy = 'p.name ASC'
      break
    case 'name_desc':
      orderBy = 'p.name DESC'
      break
  }

  // количество
  const countQuery = `SELECT COUNT(DISTINCT p.id) ${baseQuery}`
  const countResult = await pool.query(countQuery, params)
  const total = parseInt(countResult.rows[0].count)

  // данные
  const dataQuery = `
    SELECT DISTINCT p.*, pi.image_url AS image
    ${baseQuery}
    ORDER BY ${orderBy}
    LIMIT $${i} OFFSET $${i + 1}
  `

  const dataParams = [...params, limit, offset]
  const dataResult = await pool.query(dataQuery, dataParams)

  res.json({
    products: dataResult.rows,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  })
})

module.exports = router