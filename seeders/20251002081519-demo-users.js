'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    return queryInterface.bulkInsert('Empleados', [
      {
        nombre: 'Alberto',
        apellido: 'Redondo',
        email: 'albertor@demo.com',
        puesto: 'Administrativo',
        salario: 23000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Juan',
        apellido: 'Sabio',
        email: 'juans@demo.com',
        puesto: 'Desarrollador',
        salario: 35000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Naina',
        apellido: 'Johar',
        email: 'nainaj@demo.com',
        puesto: 'Directivo',
        salario: 60000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Pooja',
        apellido: 'Kumar',
        email: 'poojak@demo.com',
        puesto: 'Desarrollador',
        salario: 32000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Ali',
        apellido: 'Mukherjee',
        email: 'alim@demo.com',
        puesto: 'Encargado_limpieza',
        salario: 20000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Empleados', null, {});
  },
};
