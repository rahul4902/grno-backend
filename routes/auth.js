const express = require('express');
const { register, login } = require('../controllers/authController');
const { updateSignUpRules } = require('../validations/authRules');
const { validate } = require("../helpers/validatorHelper");
const router = express.Router();

router.post('/signup',updateSignUpRules,validate, register);
router.post('/signin', login);

module.exports = router;
