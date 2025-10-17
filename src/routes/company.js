const express = require('express');

const validate = require('../middlewares/validate');
const verifyToken = require('../middlewares/authHandler');

const idParamSchema = require('../validations/idParamsValidation');
const searchCompanySchema = require('../validations/searchCompanyValidation');

const router = express.Router();

const {
    getAllCompanies,
    getCompany
} = require('../controllers/company');

router.get('/', validate({params: searchCompanySchema}), getAllCompanies);
router.get('/:id', validate({params: idParamSchema}), getCompany);

module.exports = router;