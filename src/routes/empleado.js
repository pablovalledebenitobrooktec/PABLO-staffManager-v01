const express = require('express');

const validate = require('../middlewares/validate');
const { empleadoSchema } = require('../validations/empleadoValidation');

const router = express.Router();

const {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/empleado');

router.route('/').get(getAllEmployees).post(validate(empleadoSchema), createEmployee);
router.route('/:id').get(getEmployee).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
