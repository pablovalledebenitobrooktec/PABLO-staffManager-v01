const { StatusCodes } = require('http-status-codes');
const { Company, Employee } = require('../../models');
const { Op } = require('sequelize');

const getAllCompanies = async (req, res, next) => {
    try{

        const { name, color } = req.query;
        const where = {};

        if(name){
            where.name = { [Op.iLike]: `%${name}%`};
        }
        if(color){
            where.color = color;
        }

        const companies = await Company.findAll({where});

        res.status(StatusCodes.OK).json(companies);

    }catch (error) {
        next(error);
    }
}

const getCompany = async (req, res, next) => {
    try{
        const { id } = req.params;
        const company = await Company.findByPk(id, {
            include: {
                model: Employee,
                as: 'employees',
                attributes: ['id', 'name', 'email']
            }
        });
        if(!company){
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Company not found' });
        }

        res.status(StatusCodes.OK).json(company);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCompanies,
    getCompany
}