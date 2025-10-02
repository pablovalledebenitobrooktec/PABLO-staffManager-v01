
const employee = require('../../models/empleado');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await employee.findAll();
        console.log(employees)
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllEmployees
}