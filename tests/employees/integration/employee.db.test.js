
jest.mock('../../../src/middlewares/authHandler', () => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    if(authHeader === 'Bearer invalidtoken') return res.status(403).json({ message: 'Invalid token' });
    req.user = { id: 1, role: 'admin' };
    next();
});

const request = require('supertest');
const app = require('../../../app');

const { sequelize , Employee, Company } = require('../../../models');

beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    await Company.create({ id: 1, name: 'TestCo', color:'#FFFFFF'});

    await Employee.bulkCreate([
        {
            id: 1,
            name: 'John',
            lastName: 'Doe',
            email: 'johnd@test.com',
            position: 'Engineer',
            salary: 50000,
            password: 'secureP@ssword123',
            companyId: 1,
            profilePicture: '/images/default-pfp.png'
        },
        {
            id: 2,
            name: 'Jane',
            lastName: 'Smith',
            email: 'jane@test.com',
            position: 'Manager',
            salary: 60000,
            password: 'secureP@ssword123',
            companyId: 1,
            profilePicture: '/images/default-pfp.png'
        }
    ]);
});

afterAll(async () => {
    await sequelize.close();
});

describe('Database Integration test GET /employees ', () => {
    it('should return all employees', async () => {
        const res = await request(app)
            .get('/employees')
            .set('Authorization', 'Bearer mockedToken');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);

        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).not.toHaveProperty('password');
    });

    it('should filter by name', async () => {
        const res = await request(app)
            .get('/employees')
            .query({ name: 'John'})
            .set('Authorization', 'Bearer mockedToken');

        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('John');
    });

    it('should filter by companyId', async () => {
        const res = await request(app)
            .get('/employees')
            .query({ companyId: ['1', '2'] })
            .set('Authorization', 'Bearer mockedToken');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);

        res.body.forEach(emp => {
            expect(emp.companyId).toBe(1);
        })
    });
});

describe('Database Integration test PUT /employees/:id', () => {
    it('should update an employee', async () => {
        const res = await request(app)
            .put('/employees/1')
            .set('Authorization', 'Bearer mockedToken')
            .send({
                name: 'John Updated',
                email: 'john.updated@test.com'
            });
        
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('John Updated');
        expect(res.body.email).toBe('john.updated@test.com');
    });

    it('should return 404 on non existing employee', async () => {
        const res = await request(app)
            .put('/employees/999')
            .set('Authorization', 'Bearer mockedToken')
            .send({
                name: 'Nobody'
            });
        
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Employee not found');
    });
})
