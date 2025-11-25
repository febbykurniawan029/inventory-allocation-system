"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Stock, { foreignKey: "product_id" });
      Product.hasMany(models.PurchaseRequestItem, { foreignKey: "product_id" });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      sku: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Product;
};
