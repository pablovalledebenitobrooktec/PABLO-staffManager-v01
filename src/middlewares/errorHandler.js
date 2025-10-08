const logger = require('./logger');

const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {

    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

    if(err.status === StatusCodes.BAD_REQUEST && err.details) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.details });
    }

    if(err.name === 'SequelizeUniqueConstraintError'){
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Email already exists" });
    }

    if(err.name === 'SequelizeValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.details });
    }

    if(err.details){
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: err.details })
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
};

module.exports = errorHandler;
