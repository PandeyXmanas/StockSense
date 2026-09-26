const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryBalance = sequelize.define('InventoryBalance', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'location_id',
      references: {
        model: 'locations',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  }, {
    tableName: 'inventory_balances',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'unique_product_location_balance',
        fields: ['product_id', 'location_id']
      },
      {
        fields: ['product_id']
      },
      {
        fields: ['location_id']
      }
    ]
  });

  return InventoryBalance;
};
