'use strict';
const {
  Model,
  DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    
    static associate(models) {
      Employee.belongsTo(models.Company, {
        foreignKey: 'companyId',
        as: 'companies',
      });
    }
  }
  Employee.init({
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    position: DataTypes.STRING,
    salary: DataTypes.INTEGER,
    profilePicture: DataTypes.STRING,
    companyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees'
  });
  return Employee;
};