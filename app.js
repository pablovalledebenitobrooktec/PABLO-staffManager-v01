const express = require('express');
const app = express();

const connection = require('./config/connection');

const employeeRoutes = require('./src/routes/empleado');

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/empleados', employeeRoutes);

app.listen(5000, () => {
    console.log('Server is listening on port 5000');
})