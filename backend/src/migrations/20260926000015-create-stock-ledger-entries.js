'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stock_ledger_entries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      location_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      movement_type: {
        type: Sequelize.ENUM('RECEIPT', 'DELIVERY', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT'),
        allowNull: false
      },
      quantity_delta: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reference_type: {
        type: Sequelize.ENUM('RECEIPT', 'DELIVERY', 'TRANSFER', 'ADJUSTMENT', 'INITIAL_STOCK'),
        allowNull: false
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reference_number: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    await queryInterface.addIndex('stock_ledger_entries', ['product_id', 'location_id']);
    await queryInterface.addIndex('stock_ledger_entries', ['created_at']);
    await queryInterface.addIndex('stock_ledger_entries', ['reference_type', 'reference_id']);
    await queryInterface.addIndex('stock_ledger_entries', ['movement_type']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stock_ledger_entries');
  }
};
