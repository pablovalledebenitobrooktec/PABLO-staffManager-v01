const { Employee, Company, Project } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const getImageUrl = require('../utils/getImageUrl');
const { tokenDecode } = require('../libs/jwtHelper');

const EMPLOYEE_NOT_FOUND = 'Employee not found';
const EMPLOYEE_DELETED = 'Employee deleted';
const DEFAULT_PFP = '/images/default-pfp.png';

const getAllEmployees = async (req, res, next) => {
    try {

        const { name, email, companyId, projectId } = req.query;
        const where = {};

        if (name) {
            where.name = { [Op.iLike]: `%${name}%` };
        }
        if (email) {
            where.email = { [Op.iLike]: `%${email}%` };
        }
        if (companyId) {
            const companyIds = Array.isArray(companyId) ? companyId.map(id => Number(id)) : [Number(companyId)];
            where.companyId = { [Op.in]: companyIds };
        }

        const projectInclude = {
            model: Project,
            as: 'projects',
            attributes: ['id', 'name', 'description'],
            through: { attributes: [] },
        };

        if (projectId) {
            const projectIds = Array.isArray(projectId) ? projectId.map(id => Number(id)) : [Number(projectId)];
            projectInclude.where = { id: { [Op.in]: projectIds } };
        }

        const employees = await Employee.findAll({
            where,
            include: [{
                model: Company,
                as: 'companies',
                attributes: ['id', 'name', 'color']
            },
                projectInclude,
            ]
        });

        const employeesWithFullUrl = employees.map(emp => {
            const employeeData = emp.toJSON();
            delete employeeData.password;
            employeeData.profilePicture = getImageUrl(employeeData.profilePicture);
            return employeeData;
        })

        res.status(StatusCodes.OK).json(employeesWithFullUrl);
    } catch (error) {
        next(error);
    }
};

const getEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id, {
            include: {
                model: Company,
                as: 'companies',
                attributes: ['id', 'name', 'color']
            }
        });

        if(!employee){
            const error = new Error(EMPLOYEE_NOT_FOUND);
            error.status = StatusCodes.NOT_FOUND;
            throw error;
        }

        const employeeData = employee.toJSON();
        delete employeeData.password;
        employeeData.profilePicture = getImageUrl(employeeData.profilePicture);

        res.status(StatusCodes.OK).json(employeeData);

    } catch (error) {
        next(error);
    }
};

const createEmployee = async (req, res, next) => {
    try {
        const { name, lastName, email, position, salary, companyId, password } = req.body;
        const newEmployee = await Employee.create({
            name, lastName, email, position, salary,
            profilePicture: DEFAULT_PFP, companyId, password
        });
        if (req.file) {
            const ext = path.extname(req.file.originalname);
            const newFileName = `pfp_user_${newEmployee.id}${ext}`;
            const newPath = path.join('uploads', newFileName);

            fs.renameSync(req.file.path, newPath);

            newEmployee.profilePicture = `/uploads/${newFileName}`;
            await newEmployee.save();
        }

        const employeeData = newEmployee.toJSON();
        employeeData.profilePicture = getImageUrl(employeeData.profilePicture);

        res.status(StatusCodes.CREATED).json(employeeData);
    } catch (error) {
        next(error);
    }
}

const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, lastName, email, position, salary, password } = req.body;

        const employee = await Employee.findByPk(id);
        if (!employee) {
            const error = new Error(EMPLOYEE_NOT_FOUND);
            error.status = StatusCodes.NOT_FOUND;
            throw error;
        }

        await employee.update({ name, lastName, email, position, salary, password });
        if (req.file) {
            if (employee.profilePicture && employee.profilePicture !== DEFAULT_PFP) {
                const oldPath = path.join(__dirname, '..', '..', employee.profilePicture);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const ext = path.extname(req.file.originalname);
            const newFileName = `pfp_user_${employee.id}${ext}`;
            const newPath = path.join(path.dirname(req.file.path), newFileName);

            fs.renameSync(req.file.path, newPath);
            employee.profilePicture = `/uploads/${newFileName}`;
            await employee.save();
        }

        const employeeData = employee.toJSON();
        delete employeeData.password;
        employeeData.profilePicture = getImageUrl(employeeData.profilePicture);
        res.status(StatusCodes.OK).json(employeeData);

    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);

        if (!employee) {
            const error = new Error(EMPLOYEE_NOT_FOUND);
            error.status = StatusCodes.NOT_FOUND;
            throw error;
        }

        if (employee.profilePicture && employee.profilePicture !== DEFAULT_PFP) {
            const imagePath = path.resolve(employee.profilePicture);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await employee.destroy();

        res.status(StatusCodes.NO_CONTENT).json({ message: EMPLOYEE_DELETED });

    } catch (error) {
        next(error);
    }
};

const assignProjectsToEmployee = async (req, res, next) => {
    try {
        const { projectIds } = req.body;

        const employee = await Employee.findByPk(req.user.id);
        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        await employee.addProjects(projectIds);

        const updatedEmployee = await Employee.findByPk(req.user.id, {
            include: [{
                model: Project,
                as: 'projects',
                attributes: ['id', 'name', 'description'],
                through: { attributes: [] }
            }]
        });
        res.status(StatusCodes.OK).json(updatedEmployee.toJSON());

    } catch (error) {
        next(error);
    }
};

const removeProjectFromEmployee = async (req, res, next) => {
    try {
        const { projectIds } = req.body;

        const employee = await Employee.findByPk(req.user.id);
        if (!employee) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        await employee.removeProjects(projectIds);
        const updatedEmployee = await Employee.findByPk(req.user.id, {
            include: [{
                model: Project,
                as: 'projects',
                attributes: ['id', 'name', 'description'],
                through: { attributes: [] }
            }]
        });
        res.status(StatusCodes.NO_CONTENT).json(updatedEmployee.toJSON());

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    assignProjectsToEmployee,
    removeProjectFromEmployee
};