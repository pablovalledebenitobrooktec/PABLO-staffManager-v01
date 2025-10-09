const express = require('express');

const upload = require('../middlewares/upload');
const validate = require('../middlewares/validate');
const createEmployeeSchema = require('../validations/createEmployeeValidation');
const idParamSchema = require('../validations/idParamsValidation');
const updateEmployeeSchema = require('../validations/updateEmployeeValidation');

const router = express.Router();

const {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employee');

router.get('/', getAllEmployees);
router.get('/:id', validate({params: idParamSchema}), getEmployee);
router.post('/', upload.single('profile_picture'), validate({body: createEmployeeSchema}), createEmployee);
router.put('/:id', upload.single('profile_picture'), validate({
    params: idParamSchema,
    body: updateEmployeeSchema
}), updateEmployee);
router.delete('/:id', validate({params: idParamSchema}), deleteEmployee);

module.exports = router;
