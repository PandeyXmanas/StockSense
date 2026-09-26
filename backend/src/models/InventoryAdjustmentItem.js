const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryAdjustmentItem = sequelize.define('InventoryAdjustmentItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    adjustmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'adjustment_id',
      references: {
        model: 'inventory_adjustments',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
      references: {
        model: 'products',
        key: 'id'
      }
    },
    previousQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'previous_quantity'
    },
    countedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'counted_quantity',
      validate: {
        min: 0
      }
    },
    deltaQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'delta_quantity'
    }
  }, {
    tableName: 'inventory_adjustment_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['adjustment_id']
      },
      {
        fields: ['product_id']
      }
    ]
  });

  return InventoryAdjustmentItem;
};
