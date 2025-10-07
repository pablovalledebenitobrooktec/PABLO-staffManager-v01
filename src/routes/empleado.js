const express = require('express');

const validate = require('../middlewares/validate');
const { empleadoSchema } = require('../validations/empleadoValidation');
const { idParamSchema } = require('../validations/idParamsValidation');

const router = express.Router();

const {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/empleado');

const validation = require('../middlewares/validate');

router.get('/', getAllEmployees);
router.get('/:id', validate({params: idParamSchema}), getEmployee);
router.post('/', validate({body: empleadoSchema}), createEmployee);
router.put('/:id', validation({
    params: idParamSchema,
    body: empleadoSchema
}), updateEmployee);
router.delete('/:id', validate({params: idParamSchema}), deleteEmployee);

module.exports = router;
