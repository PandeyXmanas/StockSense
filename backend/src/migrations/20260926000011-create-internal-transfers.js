'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('internal_transfers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reference_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Canceled'),
        allowNull: false,
        defaultValue: 'Draft'
      },
      from_location_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      to_location_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'locations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
      validated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addIndex('internal_transfers', ['reference_number'], { unique: true });
    await queryInterface.addIndex('internal_transfers', ['status']);
    await queryInterface.addIndex('internal_transfers', ['from_location_id']);
    await queryInterface.addIndex('internal_transfers', ['to_location_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('internal_transfers');
  }
};
