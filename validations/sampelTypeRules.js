const { body } = require('express-validator');

const createSampleTypesRules = [    
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),    
    body('status').optional().isBoolean().withMessage('Status must be a boolean value'),
  ];

  const updateSampleTypesRules = [    
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
    body('status').optional().isBoolean().withMessage('Status must be a boolean value'),
  ];

module.exports = {
  createSampleTypesRules,updateSampleTypesRules
};
