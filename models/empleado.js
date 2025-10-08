'use strict';
const {
  Model,
  DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empleado extends Model {
    
    static associate(models) {
    
    }
  }
  Empleado.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: DataTypes.STRING,
    puesto: DataTypes.STRING,
    salario: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Empleado',
    tableName: 'Empleados'
  });
  return Empleado;
};