router.get('/', async (req, res) => {
    const { minPrice, maxPrice, brand, country, attributes } = req.query;

    let query = `
        SELECT DISTINCT p.*
        FROM products p
        LEFT JOIN product_attributes pa ON p.id = pa.product_id
        WHERE 1=1
    `;

    let values = [];
    let index = 1;

    if (minPrice) {
        query += ` AND p.price >= $${index++}`;
        values.push(minPrice);
    }

    if (maxPrice) {
        query += ` AND p.price <= $${index++}`;
        values.push(maxPrice);
    }

    if (brand) {
        query += ` AND p.brand = $${index++}`;
        values.push(brand);
    }

    if (country) {
        query += ` AND p.country = $${index++}`;
        values.push(country);
    }

    if (attributes) {
        const attrs = JSON.parse(attributes);
        for (let key in attrs) {
            query += `
            AND p.id IN (
                SELECT product_id FROM product_attributes
                WHERE attribute_name = $${index++}
                AND attribute_value = $${index++}
            )`;
            values.push(key, attrs[key]);
        }
    }

    const result = await db.query(query, values);
    res.json(result.rows);
});