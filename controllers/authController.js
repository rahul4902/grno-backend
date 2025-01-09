const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { errorResponse, successResponse } = require('../helpers/responseHelper');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = User.findOne({email:email});
        if(!userExists){
            return errorResponse(res,"User Email Already Exists.");
        }
        const user = new User({ name, email, password });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        user.save();
        return successResponse(res,user,"User register successfully");
    } catch (error) {
        return errorResponse(res,error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return errorResponse(res,"Invalid credentials.");
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
       
        user.token = token;
        user.save();
        // res.json({ token });
        // res.json({
        //     token,
        //     userDetails: {
        //       id: user._id,
        //       name: user.name,
        //       email: user.email,
        //       role: user.role,
        //     },
        //   });
          return successResponse(res,user,"Login Successfully.");
    } catch (error) {
        return errorResponse(res,error.message,error);
    }
};

module.exports = { register, login };
