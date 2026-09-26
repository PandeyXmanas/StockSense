const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ReceiptItem = sequelize.define('ReceiptItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    receiptId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'receipt_id',
      references: {
        model: 'receipts',
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    destinationLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'destination_location_id',
      references: {
        model: 'locations',
        key: 'id'
      }
    }
  }, {
    tableName: 'receipt_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['receipt_id']
      },
      {
        fields: ['product_id']
      }
    ]
  });

  return ReceiptItem;
};
