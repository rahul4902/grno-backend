const { body } = require("express-validator");
const Address = require("../models/Address"); // Assuming you have an Address model

const createAddressRules = [
 
  body("address1")
    .isString()
    .withMessage("Address line 1 must be a string")
    .notEmpty()
    .withMessage("Address line 1 is required"),
  body("address2")
    .optional()
    .isString()
    .withMessage("Address line 2 must be a string"),
  body("houseNo")
    .isString()
    .withMessage("House number must be a string")
    .notEmpty()
    .withMessage("House number is required"),
  body("locality")
    .isString()
    .withMessage("Locality must be a string")
    .notEmpty()
    .withMessage("Locality is required"),
  body("city")
    .isString()
    .withMessage("City must be a string")
    .notEmpty()
    .withMessage("City is required"),
  body("state")
    .isString()
    .withMessage("State must be a string")
    .notEmpty()
    .withMessage("State is required"),
  body("landmark")
    .optional()
    .isString()
    .withMessage("Landmark must be a string"),
  body("pincode")
    .isInt()
    .withMessage("Pincode must be a number")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Pincode must be a valid 6-digit PIN code")
    .notEmpty()
    .withMessage("Pincode is required"),
  
  body("isBillingAddress")
    .optional()
    .isBoolean()
    .withMessage("Billing address status must be a boolean"),
  body("isShippingAddress")
    .optional()
    .isBoolean()
    .withMessage("Shipping address status must be a boolean"),
  body("addressType")
    .optional()
    .isIn(["home", "office", "warehouse", "other"])
    .withMessage(
      'Address type must be one of "home", "office", "warehouse", or "other"'
    ),
];

const updateAddressRules = [
 
  body("address1")
    .optional()
    .isString()
    .withMessage("Address line 1 must be a string"),
  body("address2")
    .optional()
    .isString()
    .withMessage("Address line 2 must be a string"),
  body("houseNo")
    .optional()
    .isString()
    .withMessage("House number must be a string"),
  body("locality")
    .optional()
    .isString()
    .withMessage("Locality must be a string"),
  body("city").optional().isString().withMessage("City must be a string"),
  body("state").optional().isString().withMessage("State must be a string"),
  body("landmark")
    .optional()
    .isString()
    .withMessage("Landmark must be a string"),
  body("pincode")
    .optional()
    .isString()
    .withMessage("Pincode must be a string")
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage("Pincode must be a valid 6-digit PIN code"),
  
  body("isBillingAddress")
    .optional()
    .isBoolean()
    .withMessage("Billing address status must be a boolean"),
  body("isShippingAddress")
    .optional()
    .isBoolean()
    .withMessage("Shipping address status must be a boolean"),
  body("addressType")
    .optional()
    .isIn(["home", "office", "warehouse", "other"])
    .withMessage(
      'Address type must be one of "home", "office", "warehouse", or "other"'
    ),
];

module.exports = {
  createAddressRules,
  updateAddressRules,
};
