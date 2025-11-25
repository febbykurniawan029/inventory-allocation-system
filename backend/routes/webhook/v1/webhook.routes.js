// Routes untuk webhook.
const express = require("express");
const router = express.Router();
const webhookController = require("../../../controllers/webhookController");

// Rute: POST /api/v1/webhooks/receive-stock
router.post("/receive-stock", webhookController.receiveStock);

module.exports = router;
