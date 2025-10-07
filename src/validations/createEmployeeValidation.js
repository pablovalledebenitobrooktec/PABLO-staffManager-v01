const Joi = require('joi');

const createEmployeeSchema = Joi.object({
    nombre: Joi.string().min(2).max(100).required()
        .messages({
            'string.empty': 'Nombre is empty',
            'string.min': 'Nombre must contain more than 2 characters',
            'any.required': 'Nombre is required'
        }),
    apellido: Joi.string().min(2).max(100).required()
        .messages({
            'string.empty': 'Apellido is empty',
            'string.min': 'Apellido must contain more than 2 characters',
            'any.required': 'Apellido" is required'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.empty': 'Email is empty',
            'any.required': 'Email is required',
            'string.email': 'Email format invalid'
        }),
    puesto: Joi.string().allow(null, ''),
    salario: Joi.number().positive().allow(null)
});

module.exports = createEmployeeSchema ;