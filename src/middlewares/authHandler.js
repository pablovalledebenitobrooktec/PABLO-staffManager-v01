const { tokenDecode } = require('../libs/jwtHelper');
const { StatusCodes, getReasonPhrase } = require('http-status-codes');

const getToken = (req) => req.headers.authorization && req.headers.authorization.split(' ')[1];

const verifyToken = (req, res, next) => {
    const token = getToken(req);

    if(!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message: getReasonPhrase(StatusCodes.UNAUTHORIZED)});
    }

    try{
        const user = tokenDecode(token);
        req.user = user;
        next();
    }catch(error){
        return res.status(StatusCodes.FORBIDDEN).json({message: getReasonPhrase(StatusCodes.FORBIDDEN)});
    }
};

module.exports = verifyToken;