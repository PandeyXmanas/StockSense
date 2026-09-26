const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InventoryAdjustment = sequelize.define('InventoryAdjustment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    referenceNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: 'reference_number',
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Canceled'),
      allowNull: false,
      defaultValue: 'Draft'
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
    reason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    validatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'validated_at'
    },
    canceledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'canceled_at'
    }
  }, {
    tableName: 'inventory_adjustments',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['reference_number']
      },
      {
        fields: ['status']
      },
      {
        fields: ['location_id']
      }
    ]
  });

  return InventoryAdjustment;
};
