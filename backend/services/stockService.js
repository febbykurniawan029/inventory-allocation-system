// Service untuk logika bisnis terkait data stok.
const { Stock, Product, Warehouse } = require("../models");

const stockService = {
  // Mengambil semua data stok.
  getAllStocks: async () => {
    return await Stock.findAll({
      attributes: [
        "id",
        "warehouse_id",
        "product_id",
        "quantity",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "sku"],
        },
        {
          model: Warehouse,
          as: "warehouse",
          attributes: ["id", "name"],
        },
      ],
      raw: true,
      // Mengelompokkan hasil join.
      nest: true,
    });
  },
};
module.exports = stockService;
