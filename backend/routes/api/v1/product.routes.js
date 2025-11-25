// Routes untuk Product.
const express = require("express");
const router = express.Router();
const productController = require("../../../controllers/productController");

// Rute: GET /api/v1/products
router.get("/", productController.getAllProducts);

module.exports = router;
