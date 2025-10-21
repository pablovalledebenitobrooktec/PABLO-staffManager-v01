const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth');
const validate = require('../middlewares/validate');

const loginBodyValidationSchema = require('../validations/loginBodyValidation');

router.post('/login', validate({body: loginBodyValidationSchema}), login);


module.exports = router;