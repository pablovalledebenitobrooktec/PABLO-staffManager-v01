'use strict';
const {
  Model,
  DATE
} = require('sequelize');

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    
    static associate(models) {
      Employee.belongsTo(models.Company, {
        foreignKey: 'companyId',
        as: 'companies',
      });
      Employee.belongsToMany(models.Project, {
        through: 'employeeProjects',
        as: 'projects',
        foreignKey: 'employeeId',
        otherKey: 'projectId'
      });
    };
  }
  Employee.init({
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    position: DataTypes.STRING,
    salary: DataTypes.INTEGER,
    profilePicture: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees'
  });

  Employee.beforeCreate(async (employee) => {
    if(employee.password){
      employee.password = await bcrypt.hash(employee.password, SALT_ROUNDS);
    }
  });
  Employee.beforeUpdate(async (employee) => {
    if(employee.changed('password')){
      employee.password = await bcrypt.hash(employee.password, SALT_ROUNDS);
    }
  })

  return Employee;
};