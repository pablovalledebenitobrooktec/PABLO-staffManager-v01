'use strict';

const { allow } = require('joi');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('employees', 'profilePicture', {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: '/images/default_pfp.png'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('employees', 'profilePicture');
  }
};
