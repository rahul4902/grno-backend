const { body } = require("express-validator");

const createCouponRules = [
  body("code")    
    .isString()
    .withMessage("Code must be a string.")
    .isLength({ max: 50 })
    .withMessage("Code should not exceed 50 characters.")
    .notEmpty()
    .withMessage("Code is required."),

  body("type")
    
    .isIn(["flat", "percentage"])
    .withMessage('Type must be "flat" or "percentage".')
    .notEmpty()
    .withMessage("Type is required."),

  body("value")
    
    .isFloat({ gt: 0 })
    .withMessage("Value must be a positive number.")
    .notEmpty()
    .withMessage("Value is required."),

  body("minAmount")
    .isFloat({ min: 0 })
    .withMessage("Min Amount must be a positive number or zero.")
    .optional(),

  body("maxAmount")
    .isFloat({ min: 0 })
    .withMessage("Max Amount must be a positive number or zero.")
    .optional(),

  body("upTo")
    .isFloat({ min: 0 })
    .withMessage("Up To value must be a positive number or zero.")
    .optional(),

  body("expiryDate")
    .notEmpty()
    .withMessage("Expiry Date is required.")
    .isISO8601()
    .withMessage("Expiry Date must be a valid date format."),

  body("usageCount")
    .isInt({ min: 0 })
    .withMessage("Usage Count must be a positive integer or zero.")
    .optional(),

  body("maxUsers")
    .isInt({ min: 0 })
    .withMessage("Max Users must be a positive integer or zero.")
    .optional(),
];

const updateCouponRules = [
  body("code")
    .optional() // The code can be omitted during update
    .isString()
    .withMessage("Code must be a string.")
    .isLength({ max: 50 })
    .withMessage("Code should not exceed 50 characters."),

  body("type")
    .optional() // The type can be omitted during update
    .isIn(["flat", "percentage"])
    .withMessage('Type must be "flat" or "percentage".'),

  body("value")
    .optional() // The value can be omitted during update
    .isFloat({ gt: 0 })
    .withMessage("Value must be a positive number."),

  body("minAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Min Amount must be a positive number or zero."),

  body("maxAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max Amount must be a positive number or zero."),

  body("upTo")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Up To value must be a positive number or zero."),

  body("expiryDate")
    .optional() // The expiry date can be omitted during update
    .isISO8601()
    .withMessage("Expiry Date must be a valid date format."),

  body("usageCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Usage Count must be a positive integer or zero."),

  body("maxUsers")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Max Users must be a positive integer or zero."),
];

module.exports = {
  createCouponRules,
  updateCouponRules,
};
