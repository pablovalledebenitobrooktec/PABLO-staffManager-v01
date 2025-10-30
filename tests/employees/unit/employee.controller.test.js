const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');

jest.mock('../../../src/utils/getImageUrl', () => jest.fn((path) => path));

jest.mock('../../../models', () => {
    const actualSequelize = jest.requireActual('sequelize');
    return {
        Employee: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
            addProjects: jest.fn(),
            removeProjects: jest.fn()
        },
        Project: {},
        Company: {},
        Sequelize: actualSequelize.Sequelize,
        Op: actualSequelize.Op
    };
});

const { Employee, Project, Company } = require('../../../models');
const {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    assignProjectsToEmployee,
    removeProjectFromEmployee
} = require('../../../src/controllers/employee');


const request = require('supertest');
const app = require('../../../app');
const getImageUrl = require('../../../src/utils/getImageUrl');
const { Op } = require('sequelize');



fs.renameSync = jest.fn();
fs.unlinkSync = jest.fn();
fs.existsSync = jest.fn();

describe('Employee Controller Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            query: {},
            file: null,
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        jest.clearAllMocks();
        getImageUrl.mockImplementation(p => p);
    });

    describe('getAllEmployees', () => {
        let mockEmployees;

        beforeEach(() => {
            mockEmployees = [
                {
                    id: 1,
                    name: 'John',
                    lastName: 'Doe',
                    email: 'johnd@test.com',
                    profilePicture: 'http://localhost/pfp1.png',
                    companyId: 2,
                    projects: []
                },
                {   
                    id: 2,
                    name: 'Jane',
                    lastName: 'Smith',
                    email: 'janes@test.com',
                    profilePicture: 'http://localhost/pfp2.png',
                    companyId: 3,
                    projects: []
                    
                }
            ];
        });


        it('should retrieve all employees', async () => {
            
            Employee.findAll.mockResolvedValue(mockEmployees.map(emp => ({
                toJSON: () => emp
            })));

            await getAllEmployees(req, res, next);

            expect(Employee.findAll).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith(mockEmployees);
        });

        it('should filter by name', async () => {
            req.query.name = 'John';
            Employee.findAll.mockResolvedValue([mockEmployees[0]].map(emp => ({
                toJSON: () => emp
            })));

            await getAllEmployees(req, res, next);

            expect(Employee.findAll).toHaveBeenCalledWith({
                where: { name: { [Op.iLike]: '%John%' } },
                include: expect.any(Array)
            });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith([mockEmployees[0]]);
        });

        it('should filter by email', async () => {
            req.query.email = 'johnd@test.com';
            Employee.findAll.mockResolvedValue([mockEmployees[0]].map(emp => ({
                toJSON: () => emp
            })));

            await getAllEmployees(req, res, next);

            expect(Employee.findAll).toHaveBeenCalledWith({
                where: { email: { [Op.iLike]: '%johnd@test.com%' } },
                include: expect.any(Array)
            });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith([mockEmployees[0]]);
        });

        it('should filter by companyId', async () => {
            req.query.companyId = '2';
            Employee.findAll.mockResolvedValue([mockEmployees[0]].map(emp => ({
                toJSON: () => emp
            })));

            await getAllEmployees(req, res, next);

            expect(Employee.findAll).toHaveBeenCalledWith({
                where: { companyId: { [Op.in]: [2] } },
                include: expect.any(Array)
            });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith([mockEmployees[0]]);
        });

        it('should filter by multiple companyIds', async () => {
            req.query.companyId = ['2', '3'];
            Employee.findAll.mockResolvedValue(mockEmployees.map(emp => ({
                toJSON: () => emp
            })));

            await getAllEmployees(req, res, next);

            expect(Employee.findAll).toHaveBeenCalledWith({
                where: { companyId: { [Op.in]: [2, 3] } },
                include: expect.any(Array)
            });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith(mockEmployees);
        });

        it('shoudld filter by projectId', async () => {
            req.query.projectId = '3';
            Employee.findAll.mockResolvedValue([mockEmployees[1]].map(emp => ({
                toJSON: () => emp
            })));

            await getAllEmployees(req, res, next);

            expect(Employee.findAll).toHaveBeenCalledWith(expect.objectContaining({
                include: expect.arrayContaining([
                    expect.objectContaining({
                        as: 'projects',
                        where: { id: { [Op.in]: [3] } }
                    })
                ])
            }));
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith([mockEmployees[1]]);
        });

        it('should filter by multiple projectIds', async () => {
            
            req.query.projectId = ['3', '4'];
            Employee.findAll.mockResolvedValue(mockEmployees.map(emp => ({
                toJSON: () => emp
            })));

            await getAllEmployees(req, res, next);

            expect(Employee.findAll).toHaveBeenCalledWith(expect.objectContaining({
                include: expect.arrayContaining([
                    expect.objectContaining({
                        as: 'projects',
                        where: { id: { [Op.in]: [3, 4] } }
                    })
                ])
            }));
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith(mockEmployees);
        });

        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            Employee.findAll.mockRejectedValue(mockError);

            await getAllEmployees(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });

    });

    describe('getEmployee', () => {
        it('should retrieve an employee by ID', async () => {
            const mockEmployee = {
                id: 1,
                name: 'John',
                lastName: 'Doe',
                email: 'johnd@test.com',
                profilePicture: 'http://localhost/pfp1.png',
                companyId: 2,
            };

            req.params.id = 1;
            Employee.findByPk.mockResolvedValue({toJSON: () => mockEmployee});

            await getEmployee(req, res, next);

            expect(Employee.findByPk).toHaveBeenCalledWith(1, {
                include: {
                    model: Company,
                    as: 'companies',
                    attributes: ['id', 'name', 'color']
                }
            });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith(mockEmployee);
        });

        it('should handle employee not found', async () => {
            req.params.id = 999;
            Employee.findByPk.mockResolvedValue(null);
            
            await getEmployee(req, res, next);

            expect(Employee.findByPk).toHaveBeenCalledWith(999, {
                include: {
                    model: Company,
                    as: 'companies',
                    attributes: ['id', 'name', 'color']
                }
            });
            expect(next).toHaveBeenCalled();
            const error = next.mock.calls[0][0];
            expect(error).toBeInstanceOf(Error);
            expect(error.status).toBe(StatusCodes.NOT_FOUND);
            expect(error.message).toBe('Employee not found');
        });

        it('should handle errors', async () => {
            const mockError = new Error('Database error');
            req.params.id = 1;
            Employee.findByPk.mockRejectedValue(mockError);
            
            await getEmployee(req, res, next);
            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe('createEmployee', () => {
        it('should create a new employee', async () => {
            const newEmployeeData = {
                name: 'Alice',
                lastName: 'Johnson',
                email: 'alicej@test.com',
                position: 'Developer',
                salary: 70000,
                companyId: 2,
                password: 'secureP@ssw0rd111'
            };

            const createdEmployee = {
                id: 3,
                ...newEmployeeData,
                profilePicture: '/images/default-pfp.png'
            };

            req.body = newEmployeeData;
            Employee.create.mockResolvedValue({ toJSON: () => createdEmployee });

            await createEmployee(req, res, next);

            expect(Employee.create).toHaveBeenCalledWith({...newEmployeeData, profilePicture: '/images/default-pfp.png'});
            expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith(createdEmployee);
        });

        it('should handle profile picture upload', async () => {
            const newEmployeeData = {
                id: 3,
                profilePicture: '/images/default-pfp.png',
                toJSON: jest.fn().mockReturnValue({
                    name: 'Alice',
                    lastName: 'Johnson',
                    email: 'alicej@test.com',
                    position: 'Developer',
                    salary: 70000,
                    companyId: 2,
                    password: 'secureP@ssw0rd111',
                    profilePicture: '/uploads/pfp3.png'
                }),
                save: jest.fn().mockResolvedValue()
            };

            req.body = {
                name: 'Alice',
                lastName: 'Johnson',
                email: 'alicej@test.com',
                position: 'Developer',
                salary: 70000,
                companyId: 2,
                password: 'secureP@ssw0rd111'
            };
            req.file = {
                path: '/tmp/uploadedfile.png',
                originalname: 'uploadedfile.png'
            };

            Employee.create = jest.fn().mockResolvedValue(newEmployeeData);
            fs.renameSync = jest.fn();
            await createEmployee(req, res, next);

            expect(fs.renameSync).toHaveBeenCalledWith('/tmp/uploadedfile.png', expect.stringContaining('uploads', 'pfp_user_3.png'));
            expect(newEmployeeData.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            expect(res.json).toHaveBeenCalledWith(newEmployeeData.toJSON());
        });

        it('should call next with an error if Employee.create fails', async () => {

            const newEmployeeData = {
                name: 'Alice',
                lastName: 'Johnson',
                email: 'alicej@test.com',
                position: 'Developer',
                salary: 70000,
                companyId: 2,
                password: 'secureP@ssw0rd111'
            };
            const mockError = new Error('Validation error');

            req.body = { ...newEmployeeData, email: 'invalid-email' };
            Employee.create.mockRejectedValue(mockError);

            await createEmployee(req, res, next);

            expect(next).toHaveBeenCalled();
            const errorPassed = next.mock.calls[0][0];
            expect(errorPassed).toBe(mockError);
            expect(errorPassed.message).toBe('Validation error');
        });
    });

    describe('updateEmployee', () => {
        it('should update an existing employee', async () => {
            const existingEmployee = {
                id: 1,
                name: 'John',
                lastName: 'Doe',
                email: 'johnd@test.com',
                position: 'Developer',
                salary: 60000,
                password: 'oldPassword',
                profilePicture: '/images/default-pfp.png',
                update: jest.fn().mockResolvedValue()
            };

            const updatedData = {
                name: 'John',
                lastName: 'Doe',
                email: 'test@test.com',
                position: 'Senior Developer',
                salary: 80000,
                password: 'newSecureP@ssw0rd111',
                profilePicture: '/images/default-pfp.png'
            };

            existingEmployee.toJSON = jest.fn().mockReturnValue(updatedData);

            req.params.id = 1;
            req.body = updatedData;
            Employee.findByPk.mockResolvedValue(existingEmployee);

            await updateEmployee(req, res, next);

            expect(Employee.findByPk).toHaveBeenCalledWith(1);
            expect(existingEmployee.update).toHaveBeenCalledWith({
                name: 'John',
                lastName: 'Doe',
                email: 'test@test.com',
                position: 'Senior Developer',
                salary: 80000,
                password: 'newSecureP@ssw0rd111'
            });
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith(updatedData);
        });

        it('should handle profile picture update', async () => {
            const existingEmployee = {
                id: 1,
                profilePicture: '/images/old-pfp.png',
                update: jest.fn().mockResolvedValue(),
                save: jest.fn().mockResolvedValue(),
                toJSON: jest.fn().mockReturnValue({
                    id: 1,
                    name: 'John',
                    lastName: 'Doe',
                    email: 'johdn@test.com',
                    position: 'Developer',
                    salary: 60000,
                    password: 'oldPassword',
                    profilePicture: '/uploads/pfp_user_1.png'
                })
            };

            req.params.id = 1;
            req.body = {
                name: 'John',
                lastName: 'Doe',
                email: 'johnd@test.com',
                position: 'Developer',
                salary: 60000,
                password: 'oldPassword'
            };

            req.file = {
                path: '/tmp/uploadedfile.png',
                originalname: 'uploadedfile.png'
            };

            Employee.findByPk.mockResolvedValue(existingEmployee);
            fs.existsSync = jest.fn().mockReturnValue(true);
            fs.unlinkSync = jest.fn();
            fs.renameSync = jest.fn();

            await updateEmployee(req, res, next);

            expect(fs.existsSync).toHaveBeenCalledWith(expect.stringContaining('images/old-pfp.png'));
            expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('images/old-pfp.png'));
            expect(fs.renameSync).toHaveBeenCalledWith('/tmp/uploadedfile.png', expect.stringContaining('pfp_user_1.png'));

            expect(existingEmployee.save).toHaveBeenCalled();
            expect(existingEmployee.update).toHaveBeenCalledWith(req.body);

            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                profilePicture: expect.stringContaining('/uploads/pfp_user_1.png')
            }));
        });

        it('should handle employee not found', async () => {
            req.params.id = 999;
            Employee.findByPk.mockResolvedValue(null);

            await updateEmployee(req, res, next);

            expect(Employee.findByPk).toHaveBeenCalledWith(999);
            expect(next).toHaveBeenCalled();
            const error = next.mock.calls[0][0];
            expect(error).toBeInstanceOf(Error);
            expect(error.status).toBe(StatusCodes.NOT_FOUND);
            expect(error.message).toBe('Employee not found');
        });

        it('should handle errors during update', async () => {
            const mockError = new Error('Validation error');
            req.params.id = 1;
            Employee.findByPk.mockRejectedValue(mockError);

            await updateEmployee(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
        });
    });

    describe ('deleteEmployee', () => {
        it('should delete an existing employee', async () => {
            const existingEmployee = {
                id: 1,
                profilePicture: '/images/default-pfp.png',
                destroy: jest.fn().mockResolvedValue()
            };

            req.params.id = 1;
            Employee.findByPk.mockResolvedValue(existingEmployee);

            await deleteEmployee(req, res, next);
            
            expect(Employee.findByPk).toHaveBeenCalledWith(1);
            expect(existingEmployee.destroy).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
            expect(res.json).toHaveBeenCalledWith({ message: 'Employee deleted'});
        });

        it('should handle employee not found', async () => {
            req.params.id = 999;
            Employee.findByPk.mockResolvedValue(null);
            
            await deleteEmployee(req, res, next);
            expect(Employee.findByPk).toHaveBeenCalledWith(999);
            expect(next).toHaveBeenCalled();
            const error = next.mock.calls[0][0];
            expect(error).toBeInstanceOf(Error);
            expect(error.status).toBe(StatusCodes.NOT_FOUND);
            expect(error.message).toBe('Employee not found');
        });
    });

    describe('assignProjectsToEmployee', () => {
        it('should assign projects to an employee', async () => {
            const mockEmployee = {
                id: 1,
                addProjects: jest.fn().mockResolvedValue(),
                toJSON: jest.fn().mockReturnValue({
                    id: 1,
                    name: 'John',
                    projects: []
                })
            };
            
            req.user.id = 1;
            req.body.projectIds = [1, 2, 3];
            Employee.findByPk.mockResolvedValue(mockEmployee);
            await assignProjectsToEmployee(req, res, next);
            expect(Employee.findByPk).toHaveBeenCalledWith(1);
            expect(mockEmployee.addProjects).toHaveBeenCalledWith([1, 2, 3]);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
            expect(res.json).toHaveBeenCalledWith({
                id: 1,
                name: 'John',
                projects: []
            });
        });
        
        it('should handle employee not found', async () => {
            req.user.id = 999;
            req.body.projectIds = [1, 2, 3];
            Employee.findByPk.mockResolvedValue(null);
            await assignProjectsToEmployee(req, res, next);
            expect(Employee.findByPk).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });

    describe('removeProjectFromEmployee', () => {
        it('should remove projects from an employee', async () => {
            const mockEmployee = {
                id: 1,
                removeProjects: jest.fn().mockResolvedValue(),
                toJSON: jest.fn().mockReturnValue({
                    id: 1,
                    name: 'John',
                    projects: []
                })
            };
            
            req.user.id = 1;
            req.body.projectIds = [1, 2];
            Employee.findByPk.mockResolvedValue(mockEmployee);
            await removeProjectFromEmployee(req, res, next);
            expect(Employee.findByPk).toHaveBeenCalledWith(1);
            expect(mockEmployee.removeProjects).toHaveBeenCalledWith([1, 2]);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
            expect(res.json).toHaveBeenCalledWith({
                id: 1,
                name: 'John',
                projects: []
            });
        });
        
        it('should handle employee not found', async () => {
            req.user.id = 999;
            req.body.projectIds = [1, 2];
            Employee.findByPk.mockResolvedValue(null);
            await removeProjectFromEmployee(req, res, next);
            expect(Employee.findByPk).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });
});