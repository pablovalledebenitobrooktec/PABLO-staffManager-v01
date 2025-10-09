const { Employee } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');

const EMPLOYEE_NOT_FOUND = 'Employee not found';
const EMPLOYEE_DELETED = 'Employee deleted';
const DEFAULT_PFP = '/images/default-pfp.png';

const getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.findAll();
        res.status(StatusCodes.OK).json(employees);
    } catch (error) {
        next(error);
    }
};

const getEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);

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
        const { name, lastName, email, position, salary } = req.body;
        const newEmployee = await Employee.create({
            name, lastName, email, position, salary,
            profile_picture: DEFAULT_PFP
        });
        if(req.file){
            const ext = path.extname(req.file.originalname);
            const newFileName = `pfp_user_${newEmployee.id}${ext}`;
            const newPath = path.join(path.dirname(req.file.path), newFileName);

            fs.renameSync(req.file.path, newPath);

            newEmployee.profile_picture = `/uploads/${newFileName}`;
            await newEmployee.save();
        }

        res.status(StatusCodes.CREATED).json(newEmployee);
    } catch (error){
        next(error);
    }

}

const updateEmployee = async (req, res, next) => {
    try{
        const { id } = req.params;
        const { name, lastName, email, position, salary } = req.body;

        const employee = await Employee.findByPk(id);
        if(!employee){
            const error = new Error(EMPLOYEE_NOT_FOUND);
            error.status = StatusCodes.NOT_FOUND;
            throw error;
        }

        await employee.update({ name, lastName, email, position, salary });
        if(req.file){
            if(employee.profile_picture && employee.profile_picture !== DEFAULT_PFP){
                const oldPath = path.join(__dirname, '..', '..', employee.profile_picture);
                if(fs.existsSync(oldPath)){
                    fs.unlinkSync(oldPath);
                }
            }
            
            const ext = path.extname(req.file.originalname);
            const newFileName = `pfp_user_${newEmployee.id}${ext}`;
            const newPath = path.join(path.dirname(req.file.path), newFileName);

            fs.renameSync(req.file.path, newPath);
            employee.profile_picture = `/uploads/${newFileName}`;
            await employee.save();
        }

        res.status(StatusCodes.OK).json(employee);

    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try{
        const { id } = req.params;
        const employee = await Employee.findByPk(id);

        if(!employee){
            const error = new Error(EMPLOYEE_NOT_FOUND);
            error.status = StatusCodes.NOT_FOUND;
            throw error;
        }

        if(employee.profile_picture && employee.profile_picture !== DEFAULT_PFP){
            const imagePath = path.join(__dirname, '..', '..', employee.profile_picture);
            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath);
            }
        }
        await employee.destroy();

        res.status(StatusCodes.OK).json({ message: EMPLOYEE_DELETED });
        
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