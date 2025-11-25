// Controller untuk data stok.
const stockService = require("../services/stockService");
const responseHelper = require("../utils/responseHelper");
const catchAsync = require("../utils/catchAsync");

const stockController = {
  // Mengambil semua data stok.
  getAllStocks: catchAsync(async (req, res) => {
    const stocks = await stockService.getAllStocks();
    return responseHelper.success(res, stocks, "Stock levels retrieved successfully");
  }),
};
module.exports = stockController;
