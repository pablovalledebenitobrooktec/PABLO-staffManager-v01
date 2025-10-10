'use strict';
const {
  Model
} = require('sequelize');

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFDB33'];

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    
    static associate(models) {
      Company.hasMany(models.Employee, {
        foreignKey: 'companyId',
        as: 'employees',
      });  
    }
  }
  Company.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => {
        return colors[Math.floor(Math.random() * colors.length)];
      },
    },
  }, {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
  });
  return Company;
};