// Controller untuk webhook.
const webhookService = require("../services/webhookService");
const responseHelper = require("../utils/responseHelper");
const catchAsync = require("../utils/catchAsync");

const webhookController = {
  // Menerima response update stok dari vendor.
  receiveStock: catchAsync(async (req, res) => {
    const result = await webhookService.processStockUpdate(req.body);
    return responseHelper.success(res, result, "Webhook processed successfully");
  }),
};

module.exports = webhookController;
