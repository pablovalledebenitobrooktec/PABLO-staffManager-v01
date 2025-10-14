const Joi = require('joi');

const searchParamsSchema = Joi.object({

    name: Joi.string().min(2).max(100).optional().messages({
        'string.min': 'Name must contain more than 2 characters',
        'string.max': 'Name must contain less than 100 characters'
    }),
    color: Joi.string().hex().length(6).optional().messages({
        'string.hex': 'Color must be a valid hex code',
        'string.length': 'Color must be a valid hex code'
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Email format invalid'
    }),
    companyId: Joi.string().pattern(/^(\d+,)*\d+$/).optional().messages({
        'string.pattern.base': 'companyIds must be a comma-separated list of numbers'
    })
});

module.exports = searchParamsSchema;