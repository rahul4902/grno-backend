const { body } = require("express-validator");
const User = require("../models/User");

const createSignInRules = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const updateSignUpRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });      
      if (existingUser) {
        throw new Error("User Email already exists");
      }
      return true;
    }),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  createSignInRules,
  updateSignUpRules,
};
