const { Sequelize } = require('sequelize');
require('dotenv').config();

const {DB_NAME, DB_USER, DB_PASSWORD, DB_PORT, DB_TYPE} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: 'localhost',
    dialect: DB_TYPE,
});

async function testConnection(){
    try {
        await sequelize.authenticate();
        console.log('Connection established');
    } catch(error){
        console.error('Unable to connect to the db', error);
    }
}

testConnection();

module.exports = sequelize;