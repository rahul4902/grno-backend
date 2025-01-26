const { body } = require('express-validator');

const createBannerRules = [    
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
    body('order').notEmpty().withMessage('Order is required').isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    body('status').optional().isBoolean().withMessage('Status must be a boolean value'),
  ];

  const updateBannerRules = [    
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
    body('order').notEmpty().withMessage('Order is required').isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    body('status').optional().isBoolean().withMessage('Status must be a boolean value'),
  ];

module.exports = {
  createBannerRules,updateBannerRules
};
