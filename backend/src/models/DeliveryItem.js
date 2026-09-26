const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeliveryItem = sequelize.define('DeliveryItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    deliveryOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'delivery_order_id',
      references: {
        model: 'delivery_orders',
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
    sourceLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'source_location_id',
      references: {
        model: 'locations',
        key: 'id'
      }
    }
  }, {
    tableName: 'delivery_items',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['delivery_order_id']
      },
      {
        fields: ['product_id']
      }
    ]
  });

  return DeliveryItem;
};
