const express = require('express');

const upload = require('../middlewares/upload');
const validate = require('../middlewares/validate');
const createEmployeeSchema = require('../validations/createEmployeeValidation');
const idParamSchema = require('../validations/idParamsValidation');
const updateEmployeeSchema = require('../validations/updateEmployeeValidation');
const searchParamsSchema = require('../validations/searchParamsValidation');

const router = express.Router();

const {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employee');

router.get('/', validate({params: searchParamsSchema}), getAllEmployees);
router.get('/:id', validate({params: idParamSchema}), getEmployee);
router.post('/', upload.single('profilePicture'), validate({body: createEmployeeSchema}), createEmployee);
router.put('/:id', upload.single('profilePicture'), validate({
    params: idParamSchema,
    body: updateEmployeeSchema
}), updateEmployee);
router.delete('/:id', validate({params: idParamSchema}), deleteEmployee);

module.exports = router;
