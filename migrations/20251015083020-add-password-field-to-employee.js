'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('employees', 'password',{
      type: Sequelize.STRING,
    });
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('employees', 'password');
  },
};
