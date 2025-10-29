
jest.mock('swagger-ui-express', () => ({
    serve: (req, res, next) => next(),
    setup: () => (req, res, next) => next(),
}));

jest.mock('../../../src/middlewares/authHandler', () => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    if(authHeader === 'Bearer invalidtoken') return res.status(403).json({ message: 'Invalid token' });
    req.user = { id: 1, role: 'admin' };
    next();
});

jest.mock('../../../src/utils/getImageUrl', () => jest.fn(p => `http://localhost${p}`));

jest.mock('../../../models', () => ({
    Employee: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    },
    Company: {},
    Project: {},
}));

const request = require('supertest');
const app = require('../../../app');
const { Employee } = require('../../../models');

describe('Employee API with mocked auth and db', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /employees', () => {
        it('should return a list of employees', async () => {
            Employee.findAll.mockResolvedValue([
                {
                    toJSON: () => ({
                        id: 1,
                        name: 'John',
                        email: 'john@example.com',
                        position: 'Developer',
                        companies: { id: 1, name: 'Tech Corp', color: '#ff0000' },
                        projects: [{ id: 1, name: 'Project X', description: 'Secret' }],
                        profilePicture: '/images/default-pfp.png',
                    }),
                },
            ]);

            const res = await request(app).get('/employees')
                .set('Authorization', 'Bearer mockedtoken')
                .expect(200);

            expect(Employee.findAll).toHaveBeenCalledTimes(1);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].name).toBe('John');
            expect(res.body[0].profilePicture).toBe('http://localhost/images/default-pfp.png');
            expect(res.body[0].companies.name).toBe('Tech Corp');
            expect(res.body[0].projects[0].name).toBe('Project X');
        });

        it('should return an empty list if no employees found', async () => {
            Employee.findAll.mockResolvedValue([]);

            const res = await request(app).get('/employees')
                .set('Authorization', 'Bearer mockedtoken')
                .expect(200);

            expect(res.body).toEqual([]);
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app).get('/employees'); // sin .set('Authorization', ...)
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('No token provided');
        });

        if ('should return 403 if token is invalid', async () => {
            const res = await request(app).get('/employees')
                .set('Authorization', 'Bearer invalidtoken');
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Invalid token');
        });
    });

    describe('GET /employees/:id', () => {
        it('should return employee details for a valid ID', async () => {
            Employee.findByPk.mockResolvedValue({
                toJSON: () => ({
                    id: 1,
                    name: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    position: 'Developer',
                    salary: 60000,
                    companies: { id: 1, name: 'Tech Corp', color: '#ff0000' },
                    projects: [{ id: 1, name: 'Project X', description: 'Secret' }],
                    profilePicture: '/images/default-pfp.png',
                }),
            });

            const res = await request(app).get('/employees/1')
                .set('Authorization', 'Bearer mockedtoken')
                .expect(200);

            expect(Employee.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(res.body.name).toBe('John');
            expect(res.body.profilePicture).toBe('http://localhost/images/default-pfp.png');
            expect(res.body.companies.name).toBe('Tech Corp');
            expect(res.body.projects[0].name).toBe('Project X');
        });

        it('should return 404 for a non-existing employee ID', async () => {
            Employee.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/employees/999')
                .set('Authorization', 'Bearer mockedtoken')
                .expect(404);

            expect(res.body.message).toBe('Employee not found');
        });

        it('should return 400 for invalid employee ID', async () => {
            const res = await request(app).get('/employees/abc')
                .set('Authorization', 'Bearer mockedtoken')
                .expect(400);

            expect(res.body.message).toBe('Validation error');
            expect(res.body.errors[0].message).toBe('Parameter ID must be a number');
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app).get('/employees/1');
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('No token provided');
        });

        it('should return 403 if token is invalid', async () => {
            const res = await request(app).get('/employees/1')
                .set('Authorization', 'Bearer invalidtoken');
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Invalid token');
        });
    });

    describe('POST /employees', () => {
        it('should create a new employee whithout profile picture file', async () => {
            Employee.create.mockResolvedValue({
                toJSON: () => ({
                    id: 2,
                    name: 'Jane',
                    lastName: 'Smith',
                    email: 'janes@test.com',
                    profilePicture: '/images/default-pfp.png',
                    companyId: 1,
                    password: 'newP@ssword233',
                }),
            });

            const res = await request(app).post('/employees').send({
                name: 'Jane',
                lastName: 'Smith',
                email: 'janes@test.com',
                password: 'newP@ssword233',
                companyId: 1,
            })
                .set('Authorization', 'Bearer mockedtoken');
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Jane');
            expect(res.body.email).toBe('janes@test.com');
            expect(res.body.profilePicture).toBe('http://localhost/images/default-pfp.png');
        });

        it('should create a new employee with profile picture file', async () => {
            Employee.create.mockResolvedValue({
                toJSON: () => ({
                    id: 2,
                    name: 'Jane',
                    lastName: 'Smith',
                    email: 'janes@test.com',
                    position: 'Designer',
                    salary: 55000,
                    profilePicture: '/uploads/test-pfp.png',
                    companyId: 1,
                    password: 'newP@ssword233',
                }),
            });

            const res = await request(app).post('/employees').send({
                name: 'Jane',
                lastName: 'Smith',
                email: 'janes@test.com',
                position: 'Designer',
                salary: 55000,
                password: 'newP@ssword233',
                companyId: 1,
            })
                .set('Authorization', 'Bearer mockedtoken');
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Jane');
            expect(res.body.email).toBe('janes@test.com');
            expect(res.body.profilePicture).toBe('http://localhost/uploads/test-pfp.png');
        });

        it('should return 400 for invalid employee data', async () => {
            const res = await request(app).post('/employees').send({
                name: '',
                email: 'not-an-email',
            })
                .set('Authorization', 'Bearer mockedtoken');
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Validation error');
        });

        it('should return 409 for duplicate email', async () => {
            Employee.create.mockImplementation(() => {
                const error = new Error('Validation error');
                error.name = 'SequelizeUniqueConstraintError';
                throw error;
            });

            const res = await request(app).post('/employees').send({
                name: 'Jane',
                lastName: 'Smith',
                email: 'janes@test.com',
                position: 'Designer',
                salary: 55000,
                password: 'newP@ssword233',
                companyId: 1,
            })
                .set('Authorization', 'Bearer mockedtoken');
            expect(res.status).toBe(409);
            expect(res.body.errors).toBe('Email already exists');
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app).post('/employees').send({
                name: 'Jane',
                lastName: 'Smith',
                email: 'janes@test.com',
                position: 'Designer',
                salary: 55000,
                password: 'newP@ssword233',
                companyId: 1,
            });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('No token provided');
        });

        it('should return 403 if token is invalid', async () => {
            const res = await request(app).post('/employees').send({
                name: 'Jane',
                lastName: 'Smith',
                email: 'janes@test.com',
                position: 'Designer',
                salary: 55000,
                password: 'newP@ssword233',
                companyId: 1,
            })
                .set('Authorization', 'Bearer invalidtoken');
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Invalid token');
        });
    });

    describe('PUT /employees/:id', () => {
        let mockEmployee;

        beforeEach(() => {
            mockEmployee = {
                id: 1,
                name: 'John',
                lastName: 'Doe',
                email: 'test1@test.com',
                position: 'Developer',
                salary: 60000,
                profilePicture: '/images/default-pfp.png',
                companyId: 1,
                password: 'P@ssword233',
                update: jest.fn().mockImplementation(function (updateData) {
                    Object.assign(this, updateData);
                    return Promise.resolve(this);
                }),
                toJSON: function () {
                    return { ...this };
                },
            };
        });

        it('should update an existing employee', async () => {
            Employee.findByPk.mockResolvedValue(mockEmployee);

            const res = await request(app).put('/employees/1').send({
                name: 'John Updated',
                email: 'test@test.com',
            })
                .set('Authorization', 'Bearer mockedtoken');

            expect(res.status).toBe(200);
            expect(mockEmployee.update).toHaveBeenCalled();
            expect(res.body.name).toBe('John Updated');
            expect(res.body.email).toBe('test@test.com');
        });

        it('should return 404 when updating non-existing employee', async () => {
            Employee.findByPk.mockResolvedValue(null);

            const res = await request(app).put('/employees/999').send({
                name: 'Non Existing',
                email: 'test1@test.com',
            })
                .set('Authorization', 'Bearer mockedtoken');
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Employee not found');
        });

        it('should return 401 if no token provided', async () => {
            const res = await request(app).put('/employees/1').send({
                name: 'John Updated',
                email: 'test@test.com',
            });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('No token provided');
        });

        it('should return 403 if token is invalid', async () => {
            const res = await request(app).put('/employees/1').send({
                name: 'John Updated',
                email: 'test@test.com',
            })
                .set('Authorization', 'Bearer invalidtoken');
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Invalid token');
        });
    });

    describe('DELETE /employees/:id', () => {
        it('should delete an existing employee', async () => {
            const mockDestroy = jest.fn();
            Employee.findByPk.mockResolvedValue({
                destroy: mockDestroy,
            });

            const res = await request(app).delete('/employees/1')
                .set('Authorization', 'Bearer mockedtoken');
            expect(res.status).toBe(204);
            expect(mockDestroy).toHaveBeenCalled();
        });

        it('should return 404 when deleting non-existing employee', async () => {
            Employee.findByPk.mockResolvedValue(null);

            const res = await request(app).delete('/employees/999')
                .set('Authorization', 'Bearer mockedtoken');
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Employee not found');
        });

        it ('should return 401 if no token provided', async () => {
            const res = await request(app).delete('/employees/1');
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('No token provided');
        });

        it ('should return 403 if token is invalid', async () => {
            const res = await request(app).delete('/employees/1')
                .set('Authorization', 'Bearer invalidtoken');
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Invalid token');
        });

        afterAll(async () => {
            jest.clearAllMocks();
            await new Promise(resolve => setTimeout(resolve, 100));
        });
    });
});