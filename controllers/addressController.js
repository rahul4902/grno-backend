const { errorResponse, successResponse } = require("../helpers/responseHelper");
const Address = require("../models/Address");
const mongoose = require("mongoose");
const User = require("../models/User");

const store = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const {
      address1,
      address2,
      houseNo,
      locality,
      city,
      state,
      landmark,
      pincode,      
      isBillingAddress,
      isShippingAddress,
      isPrimary,
      addressType,
    } = req.body;


    if (isPrimary) {
      await Address.updateMany({ userId }, { isPrimary: false });
    }
    const newAddress = new Address({
      userId,
      address1,
      address2,
      houseNo,
      locality,
      city,
      state,
      landmark,
      pincode,      
      isBillingAddress,
      isShippingAddress,
      isPrimary,
      addressType,
    });
    savedAddress = await newAddress.save();

    return successResponse(res, newAddress, "Address created successfully");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal server error");
  }
};

const updateAddress = async (req, res) => {
  try {
    const { id } = req.params; // Extract address ID from request params
    const userId = req.user.id; 
    const existingAddress = await Address.findOne({ _id: id, userId });
    if (!existingAddress) {
      return errorResponse(res,"Address not found or does not belong to the user");
    }

    const {address1,address2,houseNo,locality,city,state,landmark,pincode,isPrimary,isBillingAddress,isShippingAddress,addressType} = req.body;
    
    if (isPrimary) {
      await Address.updateMany(
        { userId, _id: { $ne: id } }, // Exclude the current address being updated
        { isPrimary: false }
      );
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {address1,address2,houseNo,locality,city,state,landmark,pincode,isPrimary,isBillingAddress,isShippingAddress,addressType},
      { new: true }
    );

    return successResponse(res, updatedAddress, "Address updated successfully");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal server error");
  }
};
const list = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = await Address.find({ userId: userId });
    return successResponse(res, address, "Address list fetch successfully");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal server error");
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params; // Extract address ID from request params
    const userId = req.user.id; // Logged-in user's ID from the request (assuming it's set in a middleware)
    const existingAddress = await Address.findOne({ _id: id, userId });
    if (!existingAddress) {
      return errorResponse(
        res,
        "Address not found or does not belong to the user"
      );
    }

    // Delete the address
    await Address.findByIdAndDelete(id);

    return successResponse(res, null, "Address deleted successfully");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Internal server error");
  }
};

module.exports = { store, updateAddress,deleteAddress, list };
