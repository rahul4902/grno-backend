const { validationResult } = require("express-validator");
const { validationResponse } = require("./responseHelper");
const fs =require("fs");

const formatErrors = (errorData) => {
  const formattedErrors = {};
  errorData.errors.forEach((error) => {
    const fieldName = error.path;
    const errorMsg = error.msg;
    formattedErrors[fieldName] = errorMsg;
  });
  return formattedErrors;
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   if(req.body.uploadedImagePath){
    fs.unlink(req.body.uploadedImagePath, (err) => {
      if (err) {
        return errorResponse(res, 'Error deleting file:', err);
      }
    });
   }
    let formatedErrors = Object.values(formatErrors(errors)); 
    return validationResponse(res, formatErrors(errors),formatedErrors[0] || null);
  }

  next();
};

module.exports = {
  validate,
};
