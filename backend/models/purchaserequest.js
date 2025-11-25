"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PurchaseRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PurchaseRequest.belongsTo(models.Warehouse, {
        foreignKey: "warehouse_id",
        as: "warehouse",
      });
      PurchaseRequest.hasMany(models.PurchaseRequestItem, {
        foreignKey: "purchase_request_id",
        as: "items",
      });
    }
  }
  PurchaseRequest.init(
    {
      reference: DataTypes.STRING,
      warehouse_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PurchaseRequest",
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return PurchaseRequest;
};
