const Joi = require('joi');

const updateEmployeeSchema = Joi.object({
    nombre: Joi.string().min(2).max(100)
            .messages({
                'string.empty': 'Nombre is empty',
                'string.min': 'Nombre must contain more than 2 characters'
            }),
        apellido: Joi.string().min(2).max(100)
            .messages({
                'string.empty': 'Apellido is empty',
                'string.min': 'Apellido must contain more than 2 characters'
            }),
        email: Joi.string().email()
            .messages({
                'string.empty': 'Email is empty',
                'string.email': 'Email format invalid'
            }),
        puesto: Joi.string().allow(null, ''),
        salario: Joi.number().positive().allow(null)
}).min(1)
    .messages({
        'object.min': 'At least one field must be provided for update'
    });

module.exports = updateEmployeeSchema;