const express = require('express');

const upload = require('../middlewares/upload');
const validate = require('../middlewares/validate');

const createEmployeeSchema = require('../validations/createEmployeeValidation');
const idParamSchema = require('../validations/idParamsValidation');
const updateEmployeeSchema = require('../validations/updateEmployeeValidation');
const searchEmployeeSchema = require('../validations/searchEmployeeValidation');
const addProjectsSchema = require('../validations/assignProjectsValidation');
const removeProjectEmployeeSchema = require('../validations/removeProjectsEmployeValidation');

const router = express.Router();

const {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee, 
    assignProjectsToEmployee,
    removeProjectFromEmployee
} = require('../controllers/employee');

router.get('/', validate({query: searchEmployeeSchema}), getAllEmployees);
router.get('/:id', validate({params: idParamSchema}), getEmployee);
router.post('/', upload.single('profilePicture'), validate({body: createEmployeeSchema}), createEmployee);
router.post('/projects', validate({ body: addProjectsSchema }), assignProjectsToEmployee);
router.post('/projects/remove', validate({ body: removeProjectEmployeeSchema }), removeProjectFromEmployee);
router.put('/:id', upload.single('profilePicture'), validate({
    params: idParamSchema,
    body: updateEmployeeSchema
}), updateEmployee);
router.delete('/:id', validate({params: idParamSchema}), deleteEmployee);

module.exports = router;
