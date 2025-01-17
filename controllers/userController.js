const { errorResponse, successResponse } = require('../helpers/responseHelper');
const User = require('../models/User');


const list = async (req, res) => {
    try {
        const users = await User.find({});
        return successResponse(res,users,"User list fetch successfully");
      } catch (error) {
        console.error(error);
        return errorResponse(res,'Internal server error');
      }
};



module.exports = { list };
