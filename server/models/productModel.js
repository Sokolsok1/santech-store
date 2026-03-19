const pool = require('../config/db');

/*
  Получить товар по slug
  + характеристики
  + изображения
*/
async function getProductBySlug(slug) {

  const productQuery = `
    SELECT *
    FROM products
    WHERE slug = $1
  `

  const productResult = await pool.query(productQuery, [slug])

  if (productResult.rows.length === 0) {
    return null
  }

  const product = productResult.rows[0]

  // характеристики товара
  const attributesQuery = `
    SELECT a.name AS attribute_name, pa.value AS attribute_value
    FROM product_attributes pa
    JOIN attributes a ON a.id = pa.attribute_id
    WHERE pa.product_id = $1
  `

  const attributesResult = await pool.query(attributesQuery, [product.id])

  // изображения товара
  const imagesQuery = `
    SELECT image_url
    FROM product_images
    WHERE product_id = $1
  `

  const imagesResult = await pool.query(imagesQuery, [product.id])

  product.attributes = attributesResult.rows
  product.images = imagesResult.rows

  return product
}


/*
  Получить товары по категории
  + фильтрация по характеристикам
*/
async function getProductsByCategory(categorySlug, filters = {}) {

  let query = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = $1
  `

  const params = [categorySlug]

  let i = 2

  for (let key in filters) {

    query += `
      AND p.id IN (
        SELECT pa.product_id
        FROM product_attributes pa
        JOIN attributes a ON pa.attribute_id = a.id
        WHERE a.slug = $${i} AND pa.value = $${i + 1}
      )
    `

    params.push(key, filters[key])
    i += 2
  }

  const result = await pool.query(query, params)

  return result.rows
}


module.exports = {
  getProductBySlug,
  getProductsByCategory
}