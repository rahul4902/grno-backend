const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../helpers/responseHelper');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return errorResponse(res,'Access denied. No token provided.',"",401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);    
    req.user = decoded;
    const user = await User.findOne({_id:decoded.id});
    if (!user) {
        return errorResponse(res,'Access denied. User not found.',"",401);
    }
    next(); 
  } catch (err) {
    return errorResponse(res,'Invalid or expired token.',"",401);
  }
};

module.exports = verifyToken;
