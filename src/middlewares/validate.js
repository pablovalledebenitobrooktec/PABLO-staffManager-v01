const validation = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validation( req.body, {abortEarly: false});

        if(error){
            return res.status(400).json({
                errors: error.details.map(err => err.message)
            });
        }

        req.body = value;
        next();

    };
};

module.exports = validation;