'use strict';

const bcrypt = require('bcrypt');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASS, 10);

    await queryInterface.sequelize.query(`
      UPDATE "employees"
      SET "password" = '${hashedPassword}';
    `);

    await queryInterface.changeColumn('employees', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('employees', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "employees"
      SET "password" = 'NULL';
    `);

  }
};
