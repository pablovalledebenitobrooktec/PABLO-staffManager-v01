const patternPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[$@!#.])[A-Za-zd@$!%*?&.]{10,30}/;

const Joi = require('joi');

const createEmployeeSchema = Joi.object({
    name: Joi.string().min(2).max(100).required()
        .messages({
            'string.empty': 'Name is empty',
            'string.min': 'Name must contain more than 2 characters',
            'any.required': 'Name is required'
        }),
    lastName: Joi.string().min(2).max(100).required()
        .messages({
            'string.empty': 'Last Name is empty',
            'string.min': 'Last Name must contain more than 2 characters',
            'any.required': 'Last Name" is required'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.empty': 'Email is empty',
            'any.required': 'Email is required',
            'string.email': 'Email format invalid'
        }),
    position: Joi.string().allow(null, ''),
    salary: Joi.number().positive().allow(null),
    profilePicture: Joi.any().optional(),
    companyId: Joi.number().required().messages({
        'any.required': 'Company ID is required',
        'number.base': 'Company ID must be a number'
    }),
    password: Joi.string().regex(RegExp(patternPassword)).required().min(10).max(30)
        .messages({
            'string.empty': 'Password is empty',
            'any.required': 'Password is required',
            'object.regex': 'Password is weak',
            'string.pattern.base': 'Password is weak',
        }),
});

module.exports = createEmployeeSchema ;