'use strict';

const company = require('../models/company');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE "employees" SET "companyId" = 1 WHERE "companyId" IS NULL;`
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `UPDATE "employees" SET "companyId" = NULL WHERE "companyId" = 1;`
    );
  }
};
