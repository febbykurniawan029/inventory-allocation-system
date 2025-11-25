const express = require("express");
const router = express.Router();

// Import Sub-Routers
const productRoutes = require("./product.routes");
const stockRoutes = require("./stock.routes");
const purchaseRequestRoutes = require("./purchaseRequest.routes");

// Mount Routes
router.use("/products", productRoutes);
router.use("/stocks", stockRoutes);
router.use("/purchase/request", purchaseRequestRoutes);

module.exports = router;
