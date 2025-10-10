'use strict';

const company = require('../models/company');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { Employee } = require('../models');
    await Employee.update(
      { companyId: 1},
      { where: { companyId: null } }
    );
  },

  async down (queryInterface, Sequelize) {
    const { Employee } = require('../models');
    await Employee.update(
      { companyId: null },
      { where: {} }
    );
  }
};
