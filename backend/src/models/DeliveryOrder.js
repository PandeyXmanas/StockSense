const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeliveryOrder = sequelize.define('DeliveryOrder', {
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
    recipientName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'recipient_name'
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Canceled'),
      allowNull: false,
      defaultValue: 'Draft'
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
    sourceLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'source_location_id',
      references: {
        model: 'locations',
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
    tableName: 'delivery_orders',
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
        fields: ['created_by']
      }
    ]
  });

  return DeliveryOrder;
};
