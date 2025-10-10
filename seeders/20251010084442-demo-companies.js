'use strict';

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFDB33'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const companies = [
      { name: 'TechCorp' },
      { name: 'SoftPlus' },
      { name: 'DataSolutions' },
      { name: 'WebGen' },
      { name: 'CloudHub' }
    ].map(company => ({
      ...company,
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('companies', companies, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {});
  }
};
