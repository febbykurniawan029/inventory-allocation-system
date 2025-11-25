// Service untuk menangani webhook dari vendor.
const { PurchaseRequest, Product, Stock, sequelize } = require("../models");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");

const webhookService = {
  // Memproses payload webhook untuk update stok.
  processStockUpdate: async (payload) => {
    const transaction = await sequelize.transaction();
    try {
      const { reference, details } = payload;
      console.log(
        `[Webhook] Processing Ref: ${reference} with ${details.length} items.`
      );

      // 1. Kunci baris PR untuk mencegah race condition.
      const pr = await PurchaseRequest.findOne(
        {
          where: { reference },
          lock: transaction.LOCK.UPDATE,
        },
        { transaction }
      );

      if (!pr)
        throw new ApiError(`PR ${reference} not found`, StatusCodes.NOT_FOUND);

      // 2. Cek Idempotensi: Abaikan jika sudah diproses.
      if (pr.status === "COMPLETED") {
        console.warn(
          `[Webhook] Duplicate detected for ${reference}. Skipping.`
        );
        await transaction.rollback();
        return { message: "Already Processed", status: "Skipped" };
      }

      // Aturan: Hanya proses PR status PENDING.
      if (pr.status !== "PENDING") {
        throw new ApiError(
          `Invalid PR Status: ${pr.status}. Expected: PENDING.`,
          StatusCodes.BAD_REQUEST
        );
      }

      // Optimasi: Ambil semua produk dalam 1 query.
      const skuList = details.map((d) => d.sku_barcode);
      const products = await Product.findAll({
        where: { sku: { [Op.in]: skuList } },
        attributes: ["id", "sku", "name"],
        transaction,
      });

      // Buat map untuk akses produk O(1).
      const productMap = {};
      products.forEach((p) => {
        productMap[p.sku] = p;
      });

      // 3. Proses item dan update stok.
      for (const item of details) {
        const product = productMap[item.sku_barcode];
        if (!product) {
          throw new ApiError(
            `SKU ${item.sku_barcode} not found in Master Data. Rejecting webhook.`,
            StatusCodes.BAD_REQUEST
          );
        }

        const [stock] = await Stock.findOrCreate({
          where: {
            warehouse_id: pr.warehouse_id,
            product_id: product.id,
          },
          defaults: { quantity: 0 },
          transaction,
        });
        await stock.increment("quantity", { by: item.qty, transaction });
      }

      // 4. Update status PR menjadi COMPLETED.
      pr.status = "COMPLETED";
      await pr.save({ transaction });

      await transaction.commit();
      console.log(`[Webhook] Success. PR ${reference} completed.`);

      return { message: "Stock updated successfully", status: "Success" };
    } catch (error) {
      if (!transaction.finished) await transaction.rollback();
      throw error;
    }
  },
};

module.exports = webhookService;
