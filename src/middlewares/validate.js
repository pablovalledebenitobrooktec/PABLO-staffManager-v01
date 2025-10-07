const { StatusCodes } = require('http-status-codes');

const validation = (schemas) => {

    return (req, res, next) => {
            
        try{
            if(schemas.body){
            const { error, value } = schemas.body.validate( req.body, {abortEarly: false});

            if(error){
                const err = new Error('Validation error');
                err.status = StatusCodes.BAD_REQUEST;
                err.details = error.details.map(d => d.message);

                return next(err);
            }
            req.body = value;

        }
        if(schemas.params){
            const { error, value } = schemas.params.validate( req.params, {abortEarly: false});

            if(error){
                const err = new Error('Validation error');
                err.status = StatusCodes.BAD_REQUEST;
                err.details = error.details.map(d => d.message);

                return next(err);
            }
            req.params = value;
        }
            return next();

        }catch(err){
            return next(err);
        }
    };
};

module.exports = validation;