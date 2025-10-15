const Joi = require('joi');

const searchCompanyValidation = Joi.object({

    name: Joi.string().min(2).max(100).optional().messages({
        'string.min': 'Name must contain more than 2 characters',
        'string.max': 'Name must contain less than 100 characters'
    }),
    color: Joi.string().hex().length(6).optional().messages({
        'string.hex': 'Color must be a valid hex code',
        'string.length': 'Color must be a valid hex code'
    })
});

module.exports = searchCompanyValidation;