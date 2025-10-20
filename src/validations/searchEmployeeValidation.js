const Joi = require('joi');

const searchEmployeeValidation = Joi.object({

    name: Joi.string().min(2).max(100).optional().messages({
        'string.min': 'Name must contain more than 2 characters',
        'string.max': 'Name must contain less than 100 characters'
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Email format invalid'
    }),
    companyId: Joi.array().items(Joi.number().integer()).messages({
        'array.base': 'Company ID must be an array of numbers',
        'array.includes': 'Company ID must be an array of numbers'
    }), 
    projectId: Joi.array().items(Joi.number().integer()).messages({
        'array.base': 'Project ID must be an array of numbers',
        'array.includes': 'Project ID must be an array of numbers'
    }),
});

module.exports = searchEmployeeValidation;