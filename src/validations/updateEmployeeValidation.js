const Joi = require('joi');

const updateEmployeeSchema = Joi.object({
    name: Joi.string().min(2).max(100)
            .messages({
                'string.empty': 'Name is empty',
                'string.min': 'Name must contain more than 2 characters'
            }),
    lastName: Joi.string().min(2).max(100)
        .messages({
            'string.empty': 'Last Name is empty',
            'string.min': 'Last Name must contain more than 2 characters'
        }),
    email: Joi.string().email()
        .messages({
            'string.empty': 'Email is empty',
            'string.email': 'Email format invalid'
        }),
    position: Joi.string().allow(null, ''),
    salary: Joi.number().positive().allow(null)
}).min(1)
    .messages({
        'object.min': 'At least one field must be provided for update'
    });

module.exports = updateEmployeeSchema;