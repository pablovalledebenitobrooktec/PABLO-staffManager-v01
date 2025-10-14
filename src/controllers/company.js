const { StatusCodes } = require('http-status-codes');
const { Company } = require('../../models');

const getAllCompanies = async (req, res, next) => {
    try{
        const companies = await Company.findAll();

        res.status(StatusCodes.OK).json(companies);

    }catch (error) {
        next(error);
    }
}

const getCompany = async (req, res, next) => {
    try{
        const { id } = req.params;
        const company = await Company.findByPk(id);

        res.status(StatusCodes.OK).json(company);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCompanies,
    getCompany
}