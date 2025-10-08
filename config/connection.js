const { Sequelize } = require('sequelize');
require('dotenv').config();

const logger = require('../src/middlewares/logger');

const {DB_NAME, DB_USER, DB_PASSWORD, DB_TYPE} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: 'localhost',
    dialect: DB_TYPE,
    logging: (msg) => logger.info(msg),
});

async function testConnection(){
    try {
        await sequelize.authenticate();
        logger.info('Connection established');
    } catch(error){
        logger.error(`Unable to connect to the db ${error.message}`);
    }
}

testConnection();

module.exports = sequelize;