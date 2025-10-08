'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('employees', [
      {
        name: 'Alberto',
        lastName: 'Redondo',
        email: 'albertor@demo.com',
        position: 'Administrativo',
        salary: 23000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Juan',
        lastName: 'Sabio',
        email: 'juans@demo.com',
        position: 'Desarrollador',
        salary: 35000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Naina',
        lastName: 'Johar',
        email: 'nainaj@demo.com',
        position: 'Directivo',
        salary: 60000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pooja',
        lastName: 'Kumar',
        email: 'poojak@demo.com',
        position: 'Desarrollador',
        salary: 32000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Ali',
        lastName: 'Mukherjee',
        email: 'alim@demo.com',
        position: 'Encargado_limpieza',
        salary: 20000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    
  }
};
