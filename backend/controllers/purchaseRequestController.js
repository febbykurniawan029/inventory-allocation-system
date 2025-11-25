const { StatusCodes } = require("http-status-codes");
const purchaseRequestService = require("../services/purchaseRequestService");
const responseHelper = require("../utils/responseHelper");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const {
  createPurchaseRequestSchema,
  updatePurchaseRequestSchema,
} = require("../validations/purchaseRequestSchema");

const purchaseRequestController = {
  // GET /purchase-requests
  getAll: catchAsync(async (req, res) => {
    const data = await purchaseRequestService.getAll();
    return responseHelper.success(res, data);
  }),

  // GET /purchase-requests/:id
  getById: catchAsync(async (req, res) => {
    const data = await purchaseRequestService.getById(req.params.id);
    return responseHelper.success(res, data);
  }),

  // POST /purchase-requests
  create: catchAsync(async (req, res) => {
    const { error, value } = createPurchaseRequestSchema.validate(req.body);
    if (error)
      throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);
    const data = await purchaseRequestService.create(value);
    return responseHelper.success(res, data, "Purchase Request created", StatusCodes.CREATED);
  }),

  // PUT /purchase-requests/:id
  update: catchAsync(async (req, res) => {
    const { error, value } = updatePurchaseRequestSchema.validate(req.body);
    if (error)
      throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);
    const data = await purchaseRequestService.update(req.params.id, value);
    return responseHelper.success(res, data, "Purchase Request updated");
  }),

  // DELETE /purchase-requests/:id
  delete: catchAsync(async (req, res) => {
    await purchaseRequestService.delete(req.params.id);
    return responseHelper.success(res, null, "Purchase Request deleted");
  }),
};

module.exports = purchaseRequestController;
