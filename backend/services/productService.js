// Service untuk logika bisnis terkait produk.
const { Product } = require("../models");

const productService = {
  // Mengambil semua data produk.
  getAllProducts: async () => {
    return await Product.findAll({
      attributes: ["id", "name", "sku", "created_at", "updated_at"],
      raw: true,
    });
  },
};
module.exports = productService;
