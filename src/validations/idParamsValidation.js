const Joi = require('joi');

const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required()
        .messages({
            'any.required': 'Employee ID is required',
            'number.base': 'Employee ID must be a number',
            'number.integer': 'Employee ID must be an integer',
            'number.positive': 'Employee ID must be positive'
    })
});

module.exports = idParamSchema;