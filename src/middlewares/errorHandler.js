const logger = require();

const errorHandler = (err, req, res, next) => {
    logger.error(err.message);

if(err.name === 'SequelizeUniqueConstraintError'){
    return res.status(400).json({ error: "El email ya está registrado" });
}

if(err.name === 'SequelizeValidationError') {
    return res.status(400).json({ errors: err.errors.map(e => e.message)});
}

res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;
