require('dotenv').config();
const { Employee } = require('../../models');
const { userEncode } = require('../libs/jwtHelper');
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');


const login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const user = await Employee.findOne({ where: {email}});
        if(!user){
            return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invalid credentials'});
        }
        if(!(await bcrypt.compare(password, user.password))){
            return res.status(StatusCodes.UNAUTHORIZED).json({message: 'Invalid credentials'});
        }   

        const token = userEncode(user);

        res.status(StatusCodes.OK).json({
            message: 'Login Succesfull',
            token
        });

    }catch(error){
        next(error);
    }
}

module.exports = { login };