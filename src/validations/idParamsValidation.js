const Joi = require('joi');

const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required()
        .messages({
            'any.required': 'Parameter ID is required',
            'number.base': 'Parameter ID must be a number',
            'number.integer': 'Parameter ID must be an integer',
            'number.positive': 'Parameter ID must be positive'
    })
});

module.exports = idParamSchema;