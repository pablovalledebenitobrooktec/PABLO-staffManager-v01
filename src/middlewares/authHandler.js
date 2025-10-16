const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Token not provided'});
    }

    jwt.verify(token, ENCRYPTION_KEY, (err, user) => {
        if(err){
            return res.status(StatusCodes.FORBIDDEN).json({message: 'Token invalid or expired'});
        }
        req.user = user;
        next();
    });
};

module.exports = verifyToken;