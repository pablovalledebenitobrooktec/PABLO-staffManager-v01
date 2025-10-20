const Joi = require('joi');

const removeProjectEmployeeSchema = Joi.object({
    projectIds: Joi.array().items(Joi.number()).min(1).required()
    .messages({
        'array.base': 'projectIds must be an array',
        'array.min': 'You must assign at least one project',
        'number.base': 'Each projectId must be a number',
        'number.positive': 'Each projectId must be a positive number',
        'any.required': 'projectIds field is required'
    })
}); 

module.exports = removeProjectEmployeeSchema;