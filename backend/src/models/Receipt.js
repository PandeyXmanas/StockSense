const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Receipt = sequelize.define('Receipt', {
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
    supplierName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'supplier_name',
      validate: {
        notEmpty: true
      }
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
    destinationLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'destination_location_id',
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
    tableName: 'receipts',
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

  return Receipt;
};
