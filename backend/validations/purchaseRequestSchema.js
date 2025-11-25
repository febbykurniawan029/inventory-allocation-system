// Skema validasi Joi untuk Purchase Request.
const Joi = require("joi");

// Skema untuk membuat PR baru.
const createPurchaseRequestSchema = Joi.object({
  warehouse_id: Joi.number().integer().required(),
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

// Skema untuk update PR.
const updatePurchaseRequestSchema = Joi.object({
  warehouse_id: Joi.number().integer(),
  // Status hanya bisa diubah ke PENDING.
  status: Joi.string().valid("PENDING").optional(),
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1),
});

module.exports = {
  createPurchaseRequestSchema,
  updatePurchaseRequestSchema,
};
