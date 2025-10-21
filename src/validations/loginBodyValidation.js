const { Joi } = require('express-validation');

const loginBodyValidation = Joi.object({
    email: Joi.string().email().required()
    .messages({
        'string.empty': 'Email is empty',
        'any.required': 'Email is required',
        'string.email': 'Email format invalid'
    }),
    password: Joi.string().required()
    .messages({
        'string.empty': 'Password is empty',
        'any.required': 'Password is required'
    }),
});

module.exports = loginBodyValidation;