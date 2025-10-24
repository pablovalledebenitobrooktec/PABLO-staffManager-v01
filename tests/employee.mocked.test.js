const request = require('supertest');
const app = require('../app');

jest.mock('../src/middlewares/authHandler', ()  =>  (req, res, next) => {
    req.user = { id: 1, role: 'admin' };
    next();
});

jest.mock('../src/utils/getImageUrl', () => jest.fn(p => `http://localhost${p}`));

jest.mock('../models', () => ({
    Employee: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    Company: {},
    Project: {},
}));

const { Employee } = require('../models');

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
        }, 10000);

        it('should return an empty list if no employees found', async () => {
            Employee.findAll.mockResolvedValue([]);

            const res = await request(app).get('/employees')
                .set('Authorization', 'Bearer mockedtoken')
                .expect(200);

            expect(res.body).toEqual([]);
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
                    companies: { id: 1, name: 'Tech Corp', color: '#ff0000' },
                    projects: [{ id: 1, name: 'Project X', description: 'Secret' }],
                    profilePicture: '/images/default-pfp.png',npm
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
    });
});

