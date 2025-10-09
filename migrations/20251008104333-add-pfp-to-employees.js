'use strict';

const { allow } = require('joi');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('employees', 'profile_picture', {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: '/images/default_pfp.png'
    });
  },

  async down (queryInterface, Sequelize) {
    
  }
};
