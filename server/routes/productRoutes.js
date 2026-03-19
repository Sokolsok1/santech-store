const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/category/:slug', productController.getProductsByCategory);
router.get('/:slug', productController.getProduct);

module.exports = router;