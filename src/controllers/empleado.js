const { Empleado } = require('../../models');
const { StatusCodes } = require('http-status-codes');

const EMPLOYEE_NOT_FOUND = 'Employee not found';

const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Empleado.findAll();
        res.status(StatusCodes.OK).json(employees);
    } catch (error) {
        next(error);
    }
};

const getEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await Empleado.findByPk(id);

        if(!employee){
            const error = new Error(EMPLOYEE_NOT_FOUND);
            error.status = StatusCodes.NOT_FOUND;
            throw error;
        }

        res.status(StatusCodes.OK).json(employee);

    } catch(error){
        next(error);
    }
};

const createEmployee = async (req, res, next) => {
    try{
        const { nombre, apellido, email, puesto, salario} = req.body;

        const newEmployee = await Empleado.create({
            nombre, apellido, email, puesto, salario
        });

        res.status(StatusCodes.CREATED).json(newEmployee);
    } catch (error) {
        next(error);
    }
}

const updateEmployee = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { nombre, apellido, email, puesto, salario } = req.body;

        const employee = await Empleado.findByPk(id);
        if(!employee){
            const error = new Error(EMPLOYEE_NOT_FOUND);
            error.status = StatusCodes.NOT_FOUND;
            throw error;
        }

        await employee.update({ nombre, apellido, email, puesto, salario });
        res.status(StatusCodes.OK).json(employee);

    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try{
        const { id } = req.params;
        const employee = await Empleado.findByPk(id);

        if(!employee){
            const error = new Error(EMPLOYEE_NOT_FOUND);
            error.status = StatusCodes.NOT_FOUND;
            throw error;
        }
        await employee.destroy();

        res.status(StatusCodes.OK).json({ message: 'Employee deleted' });
        
    } catch (error){
        next(error);
    }
};

module.exports = {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
};