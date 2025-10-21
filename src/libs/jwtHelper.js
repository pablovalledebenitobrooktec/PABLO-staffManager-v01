const jwt = require('jsonwebtoken');
const { auth } = require('../../config/config').development;

const tokenDecode = (token) => jwt.verify(token, auth.secret);
const dataEncode = (data) => jwt.sign(data, auth.secret, {expiresIn: auth.expiresIn});

const userEncode = (user) => {
    const {
        id, name, email,
    } = user;

    const tokenData = {
        id,
        name,
        email
    };
    return dataEncode(tokenData);
}

module.exports = {
    tokenDecode,
    dataEncode,
    userEncode,
}