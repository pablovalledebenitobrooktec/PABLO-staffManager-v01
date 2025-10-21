'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const projects = [
      { name: 'Proyecto Alpha', description: 'Descripción del Proyecto Alpha', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Proyecto Beta', description: 'Descripción del Proyecto Beta', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Proyecto Gamma', description: 'Descripción del Proyecto Gamma', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Proyecto Delta', description: 'Descripción del Proyecto Delta', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Proyecto Epsilon', description: 'Descripción del Proyecto Epsilon', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('projects', projects, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projects', null, {});
  }
};