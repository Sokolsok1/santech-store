const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// ❗ СНАЧАЛА category
router.get('/category/:slug', productController.getProductsByCategory);

// ❗ ПОТОМ одиночный товар
router.get('/:slug', productController.getProduct);

module.exports = router;