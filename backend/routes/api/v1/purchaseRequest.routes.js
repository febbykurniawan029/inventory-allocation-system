// Routes untuk Purchase Request.
const express = require("express");
const router = express.Router();
const purchaseRequestController = require("../../../controllers/purchaseRequestController");

// Rute: /api/v1/purchase-requests
router
  .route("/")
  .get(purchaseRequestController.getAll)
  .post(purchaseRequestController.create);

// Rute: /api/v1/purchase-requests/:id
router
  .route("/:id")
  .get(purchaseRequestController.getById)
  .put(purchaseRequestController.update)
  .delete(purchaseRequestController.delete);

module.exports = router;
