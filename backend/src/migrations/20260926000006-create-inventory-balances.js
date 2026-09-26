'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inventory_balances', {
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
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // Unique constraint on (product_id, location_id) ensures one authoritative balance per location
    await queryInterface.addIndex('inventory_balances', ['product_id', 'location_id'], {
      unique: true,
      name: 'unique_product_location_balance'
    });

    await queryInterface.addIndex('inventory_balances', ['product_id']);
    await queryInterface.addIndex('inventory_balances', ['location_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventory_balances');
  }
};
