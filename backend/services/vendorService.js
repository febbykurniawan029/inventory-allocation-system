// Service untuk interaksi dengan API vendor.
const axios = require("axios");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require("http-status-codes");

const vendorService = {
  // Mengirim data PO ke API vendor.
  sendPurchaseOrder: async (purchaseRequest, items) => {
    try {
      const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
      const details = items.map((item) => ({
        product_name: item.product.name,
        sku_barcode: item.product.sku,
        qty: item.quantity,
      }));
      const payload = {
        vendor: "PT FOOM LAB GLOBAL",
        reference: purchaseRequest.reference,
        qty_total: totalQty,
        details: details,
      };

      // Kirim request dengan timeout.
      const response = await axios.post(process.env.VENDOR_API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          "secret-key": process.env.VENDOR_SECRET_KEY,
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      // Penanganan error koneksi ke vendor.
      let errorMessage = "Failed to connect to Vendor API";
      let statusCode = StatusCodes.BAD_GATEWAY;

      // Kasus 1: Vendor merespons dengan error.
      if (error.response) {
        console.error("[Vendor API Error Response]:", error.response.data);
        errorMessage = `Vendor Rejected: ${JSON.stringify(
          error.response.data
        )}`;
        statusCode = StatusCodes.BAD_REQUEST;
      // Kasus 2: Tidak ada respons (timeout).
      } else if (error.request) {
        console.error("[Vendor API No Response]:", error.message);
        errorMessage =
          "Vendor API is unreachable (Timeout). Please try again later.";
        statusCode = StatusCodes.GATEWAY_TIMEOUT;
      // Kasus 3: Error lain saat request.
      } else {
        console.error("[Vendor Service Error]:", error.message);
        errorMessage = error.message;
      }
      throw new ApiError(errorMessage, statusCode);
    }
  },
};

module.exports = vendorService;
