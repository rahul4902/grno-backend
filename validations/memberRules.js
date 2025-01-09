const { body } = require('express-validator');
const Member = require('../models/Member');

const createMemberRules = [
  body('age').optional().isNumeric().withMessage('Age must be a number'),
  body('dob').optional().isISO8601().withMessage('DOB must be a valid date'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .custom(async (value) => {
      const existingMember = await Member.findOne({ name: value });
      if (existingMember) {
        throw new Error('Name already exists');
      }
      return true;
    }),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('phone').isMobilePhone().withMessage('Phone must be a valid number'),
  body('relation').notEmpty().withMessage('Relation is required'),
];

  const updateMemberRules = [    
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
    body('order').notEmpty().withMessage('Order is required').isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    body('status').optional().isBoolean().withMessage('Status must be a boolean value'),
  ];

module.exports = {
  createMemberRules,updateMemberRules
};
