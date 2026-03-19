const pool = require('../config/db');

const getAllCategories = async () => {
    const result = await pool.query(`
        SELECT id, name, slug, parent_id
        FROM categories
        ORDER BY id ASC
    `);

    return result.rows;
};

module.exports = {
    getAllCategories
};