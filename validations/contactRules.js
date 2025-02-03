const { body } = require("express-validator");

const contactRules = [
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .notEmpty()
    .withMessage("Name is required."),
  body("email")
    .isEmail()
    .withMessage("Please enter valid email.")
    .notEmpty()
    .withMessage("Email is required."),
  body("mobile")
    .isInt()
    .withMessage("Please enter valid number.")
    .notEmpty()
    .withMessage("mobile number is required."),
];

module.exports = {
  contactRules,
};
