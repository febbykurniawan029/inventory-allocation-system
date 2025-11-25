// Service untuk logika bisnis Purchase Request (PR).
const {
  PurchaseRequest,
  PurchaseRequestItem,
  Product,
  Warehouse,
  sequelize,
} = require("../models");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");
const vendorService = require("./vendorService");

const purchaseRequestService = {
  // 1. Mengambil semua data PR.
  getAll: async () => {
    return await PurchaseRequest.findAll({
      include: [
        { model: Warehouse, as: "warehouse", attributes: ["name"] },
        {
          model: PurchaseRequestItem,
          as: "items",
          include: [
            { model: Product, as: "product", attributes: ["name", "sku"] },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  },

  // 2. Mengambil detail PR berdasarkan ID.
  getById: async (id) => {
    const pr = await PurchaseRequest.findByPk(id, {
      attributes: [
        "id",
        "reference",
        "warehouse_id",
        "status",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Warehouse,
          as: "warehouse",
          attributes: ["id", "name"],
        },
        {
          model: PurchaseRequestItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "sku"],
            },
          ],
        },
      ],
    });
    if (!pr)
      throw new ApiError("Purchase Request not found", StatusCodes.NOT_FOUND);
    return pr;
  },

  // 3. Membuat PR baru (transaksional).
  create: async (data) => {
    const transaction = await sequelize.transaction();
    try {
      const reference = uuidv4();

      // Buat header PR.
      const pr = await PurchaseRequest.create(
        {
          reference,
          warehouse_id: data.warehouse_id,
          status: "DRAFT",
        },
        { transaction }
      );

      // Siapkan dan simpan item-item PR.
      const itemsData = data.items.map((item) => ({
        purchase_request_id: pr.id,
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      await PurchaseRequestItem.bulkCreate(itemsData, { transaction });

      // Selesaikan transaksi.
      await transaction.commit();
      return await purchaseRequestService.getById(pr.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  // 4. Memperbarui PR (transaksional).
  update: async (id, data) => {
    const transaction = await sequelize.transaction();
    try {
      const pr = await PurchaseRequest.findByPk(id, {
        include: [
          { model: PurchaseRequestItem, as: "items", include: ["product"] },
        ],
      });

      if (!pr)
        throw new ApiError("Purchase Request not found", StatusCodes.NOT_FOUND);

      // Aturan: Hanya status DRAFT yang bisa diubah.
      if (pr.status !== "DRAFT") {
        throw new ApiError(
          "Cannot update. Status is not DRAFT.",
          StatusCodes.BAD_REQUEST
        );
      }

      // Update data warehouse atau item.
      if (data.warehouse_id) pr.warehouse_id = data.warehouse_id;
      if (data.items && data.items.length > 0) {
        await PurchaseRequestItem.destroy({
          where: { purchase_request_id: id },
          transaction,
        });

        const itemsData = data.items.map((item) => ({
          purchase_request_id: pr.id,
          product_id: item.product_id,
          quantity: item.quantity,
        }));
        await PurchaseRequestItem.bulkCreate(itemsData, { transaction });
      }

      await pr.save({ transaction });
      await transaction.commit();

      // Jika status diubah ke 'PENDING', kirim order ke vendor.
      if (data.status === "PENDING") {
        const freshPR = await PurchaseRequest.findByPk(id, {
          include: [
            {
              model: PurchaseRequestItem,
              as: "items",
              include: [{ model: Product, as: "product" }],
            },
          ],
        });

        // Panggil service vendor.
        await vendorService.sendPurchaseOrder(freshPR, freshPR.items);

        // Update status setelah berhasil terkirim.
        freshPR.status = "PENDING";
        await freshPR.save();

        return freshPR;
      }

      return await purchaseRequestService.getById(id);
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  },

  // 5. Menghapus PR.
  delete: async (id) => {
    const pr = await PurchaseRequest.findByPk(id);
    if (!pr)
      throw new ApiError("Purchase Request not found", StatusCodes.NOT_FOUND);

    // Aturan: Hanya status DRAFT yang bisa dihapus.
    if (pr.status !== "DRAFT") {
      throw new ApiError(
        "Cannot delete. Status is not DRAFT.",
        StatusCodes.BAD_REQUEST
      );
    }

    await pr.destroy();
    return true;
  },
};

module.exports = purchaseRequestService;
