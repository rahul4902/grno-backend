const errorLogger = require('./commonHelper').logErrorToFile
const errorResponse = (res, message, error = "", statusCode = 400) => {
  if(statusCode == 501){
    errorLogger(error)
  }
  console.error("Error :", error);
  return res.status(statusCode==401?401:200).json({ status: statusCode, message: message });
};

const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(200).json({ status: statusCode, message, data });
};



const validationResponse = (
  res,
  errors,
  message = "Validaiton error",
  statusCode = 422
) => {
  return res.status(200).json({ status: statusCode, message: message, errors });
};

const paginationResponse = (
  res,
  data,
  message,
  page,
  limit,
  totalCount,  
  statusCode = 200,
) => {
  const totalPages = Math.ceil(totalCount / limit);
  return res.status(statusCode).json({
    status: statusCode,
    data,
    message,
    pagination: {
      totalItems: totalCount,
      totalPages:totalPages,
      currentPage: page,
      pageSize: limit,
    },
  });
};

module.exports = {
  errorResponse,
  successResponse,
  validationResponse,
  paginationResponse,
};
