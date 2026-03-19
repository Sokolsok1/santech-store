const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/:slug', productController.getProduct);
router.get('/category/:slug', productController.getProductsByCategory);

module.exports = router;