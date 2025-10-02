const express = require('express');
const app = express();

const connection = require('./config/connection');

const employee = require('./src/routes/empleado');

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/empleados', employee);

app.get('/empleados', (req, res) => {
    res.status(200).json({success: true, data: employee})
})

app.listen(5000, () => {
    console.log('Server is listening on port 5000');
})