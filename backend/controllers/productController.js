// Controller untuk data produk.
const productService = require("../services/productService");
const responseHelper = require("../utils/responseHelper");
const catchAsync = require("../utils/catchAsync");

const productController = {
  // Mengambil semua data produk.
  getAllProducts: catchAsync(async (req, res) => {
    const products = await productService.getAllProducts();
    return responseHelper.success(res, products, "Products retrieved successfully");
  }),
};
module.exports = productController;
