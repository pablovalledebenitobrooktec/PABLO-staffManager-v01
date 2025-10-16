require('dotenv').config();
const { Employee } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const ENCRYPTION_KEY = process.env.JWT_SECRET;

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

        const token = jwt.sign(
            {id: user.id, email: user.email},
            ENCRYPTION_KEY,
            {expiresIn: '1h'}
        );

        res.status(StatusCodes.OK).json({
            message: 'Login Succesfull',
            token
        });


    }catch(error){
        next(error);
    }
}

module.exports = { login };