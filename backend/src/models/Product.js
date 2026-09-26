const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    unitOfMeasure: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'pcs',
      field: 'unit_of_measure'
    },
    minReorderLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'min_reorder_level',
      validate: {
        min: 0
      }
    },
    initialStock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'initial_stock'
    }
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['sku']
      },
      {
        fields: ['category_id']
      }
    ]
  });

  return Product;
};
