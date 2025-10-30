const bcrypt = require('bcrypt');
const { Employee, Company, sequelize} = require('../../../models');

const SALT_ROUNDS = 10;

describe('Employee Model test', () => {
    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({force: true});

        await Company.create({ id: 1, name: 'TestCo', color: '#FFFFFF' });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('beforeCreate hook', () => {
        it('should hash password before creating employee', async () => {
            const plainPassword = 'mySecret@123';

            const employee = await Employee.create({
                name: 'John',
                lastName: 'Doe',
                email: 'johnd@test.com',
                password: plainPassword,
                companyId: 1,
            });

            expect(employee.password).not.toBe(plainPassword);
            expect(await bcrypt.compare(plainPassword, employee.password)).toBe(true);

        });

    });
    
    describe('beforeUpdate hook', () => {
        it('should hash password when it is changed', async () => {
            const employee = await Employee.create({
                name: 'Mike',
                lastName: 'Tyson',
                email: 'miket@test.com',
                password: 'Initi@l123',
                companyId: 1,
            });

            const newPassword = 'newSecret@123';
            await employee.update({password: newPassword});

            expect(employee.password).not.toBe(newPassword);
            expect(await bcrypt.compare(newPassword, employee.password)).toBe(true);
        });

        it('should not rehash password if it is not changed', async () => {
            const employee = await Employee.create({
                name: 'Anna',
                lastName: 'Bell',
                email: 'anna@test.com',
                password: 'abc123',
                companyId: 1,
            });

            const oldPasswordHash = employee.password;
            await employee.update({ name: 'Anna Updated' });

            expect(employee.password).toBe(oldPasswordHash);
        });
    });
});