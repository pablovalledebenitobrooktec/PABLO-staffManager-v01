const SERVER_PORT = 5000;

const express = require('express');
const path = require('path');
const app = express();

const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const verifyToken = require('./src/middlewares/authHandler');

const employeeRoutes = require('./src/routes/employee');
const companyRoutes = require('./src/routes/company');
const authRoute = require('./src/routes/auth');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoute);
app.use('/employees', verifyToken, employeeRoutes);
app.use('/companies', verifyToken, companyRoutes);

app.use(errorHandler);

app.listen(SERVER_PORT, () => {
    logger.info(`Server is listening on port ${SERVER_PORT}`);
});