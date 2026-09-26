const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InternalTransferItem = sequelize.define('InternalTransferItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    transferId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'transfer_id',
      references: {
        model: 'internal_transfers',
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
    }
  }, {
    tableName: 'internal_transfer_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['transfer_id']
      },
      {
        fields: ['product_id']
      }
    ]
  });

  return InternalTransferItem;
};
