const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InternalTransfer = sequelize.define('InternalTransfer', {
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
    fromLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'from_location_id',
      references: {
        model: 'locations',
        key: 'id'
      }
    },
    toLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'to_location_id',
      references: {
        model: 'locations',
        key: 'id'
      },
      validate: {
        isDifferentFromSource(value) {
          if (value === this.fromLocationId) {
            throw new Error('Destination location must be different from source location.');
          }
        }
      }
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
    tableName: 'internal_transfers',
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
        fields: ['from_location_id']
      },
      {
        fields: ['to_location_id']
      }
    ]
  });

  return InternalTransfer;
};
