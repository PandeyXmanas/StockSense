const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StockLedgerEntry = sequelize.define('StockLedgerEntry', {
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
    movementType: {
      type: DataTypes.ENUM('RECEIPT', 'DELIVERY', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT'),
      allowNull: false,
      field: 'movement_type'
    },
    quantityDelta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'quantity_delta'
    },
    referenceType: {
      type: DataTypes.ENUM('RECEIPT', 'DELIVERY', 'TRANSFER', 'ADJUSTMENT', 'INITIAL_STOCK'),
      allowNull: false,
      field: 'reference_type'
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reference_id'
    },
    referenceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reference_number'
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  }, {
    tableName: 'stock_ledger_entries',
    timestamps: false, // Ledger entries are append-only audit rows
    underscored: true,
    indexes: [
      {
        fields: ['product_id', 'location_id']
      },
      {
        fields: ['created_at']
      },
      {
        fields: ['reference_type', 'reference_id']
      },
      {
        fields: ['movement_type']
      }
    ]
  });

  return StockLedgerEntry;
};
