const SERVER_PORT = 5000;

const express = require('express');
const path = require('path');
const app = express();

const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const employeeRoutes = require('./src/routes/employee');
const companyRoutes = require('./src/routes/company');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/employees', employeeRoutes);
app.use('/companies', companyRoutes);

app.use(errorHandler);

app.listen(SERVER_PORT, () => {
    logger.info(`Server is listening on port ${SERVER_PORT}`);
})