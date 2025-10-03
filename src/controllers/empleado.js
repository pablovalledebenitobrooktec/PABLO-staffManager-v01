const { Empleado } = require('../../models');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Empleado.findAll();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Empleado.findByPk(id);

        if(!employee){
            return res.status(404).json({ error: 'Empleado no encontrado '});
        }

        res.status(200).json(employee);
    } catch(error){
        res.status(500).json({ error: error.message });
    }
};

const createEmployee = async (req, res) => {
    try{
        const { nombre, apellido, email, puesto, salario} = req.body;

        if(!nombre || !apellido || !email) {
            return res.status(400).json({
                error: 'Los campos nombre, apellido y email son obligatorios'
            });
        }
        const newEmployee = await Empleado.create({
            nombre, apellido, email, puesto, salario
        });

        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateEmployee = async (req, res) => {
    try{
        const { id } = req.params;
        const { nombre, apellido, email, puesto, salario } = req.body;

        const employee = await Empleado.findByPk(id);
        if(!employee){
            return res.status(404).json({ error: 'Empleado no encontrado '});
        }

        await employee.update({ nombre, apellido, email, puesto, salario });

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try{
        const { id } = req.params;
        const employee = await Empleado.findByPk(id);

        if(!employee){
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        await employee.destroy();

        res.status(200).json({ message: 'Empleado eliminado correctamente' });
    } catch (error){
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
};