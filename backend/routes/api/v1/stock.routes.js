// Routes untuk Stock.
const express = require("express");
const router = express.Router();
const stockController = require("../../../controllers/stockController");

// Rute: GET /api/v1/stocks
router.get("/", stockController.getAllStocks);

module.exports = router;
