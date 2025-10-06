const { StatusCodes } = require('http-status-codes');

const validation = (schema) => {

    return (req, res, next) => {
        const { error, value } = schema.validate( req.body, {abortEarly: false});

        if(error){

            const err = new Error('Validation error');
            err.status = StatusCodes.BAD_REQUEST;
            err.details = error.details;

            return next(err);
        }

        req.body = value;
        next();

    };

};

module.exports = validation;