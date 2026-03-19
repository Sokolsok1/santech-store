const productModel = require('../models/productModel');

const getProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel.getProductBySlug(slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const filters = req.query; // пример: ?diameter=1/2&material=латунь
    const products = await productModel.getProductsByCategory(slug, filters);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProduct, getProductsByCategory };