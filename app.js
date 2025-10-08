const SERVER_PORT = 5000;

const express = require('express');
const app = express();

const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');

const employeeRoutes = require('./src/routes/employee');

app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use(logger);

app.use('/employees', employeeRoutes);

app.use(errorHandler);

app.listen(SERVER_PORT, () => {
    logger.info(`Server is listening on port ${SERVER_PORT}`);
})