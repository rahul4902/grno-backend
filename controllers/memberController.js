const { errorResponse, successResponse } = require('../helpers/responseHelper');
const Member = require('../models/Member');
const mongoose = require('mongoose');
const User = require('../models/User');

const store = async (req, res) => {
    try {
        const { age, dob, email, name, gender, phone, relation } = req.body;  
        const userId = req.user.id;  
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return errorResponse(res,"Invalid user ID.");
        }

        const user = await User.findOne({_id:userId});
        if (!user) {
          return errorResponse(res,'Logged-in user not found');
        }
  
        const member = new Member({
          age,
          dob,
          email,
          name,
          gender,
          phone,
          relation,
          user: userId,
        });
  
        // Save the member to the database
        const savedMember = await member.save();
        return successResponse(res,savedMember,"Member created successfully");
        //res.status(201).json({ message: 'Member created successfully', member: savedMember });
      } catch (error) {
        console.error(error);
        return errorResponse(res,'Internal server error');
      }
};
const list = async (req, res) => {
    try {
        const userId = req.user.id;  
        const members = await Member.find({user:userId});
        return successResponse(res,members,"Member list fetch successfully");
      } catch (error) {
        console.error(error);
        return errorResponse(res,'Internal server error');
      }
};



module.exports = { store,list };
