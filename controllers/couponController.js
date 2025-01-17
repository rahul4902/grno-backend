const { compressImage } = require("../helpers/compressHelper");
const {
  successResponse,
  errorResponse,
  paginationResponse,
} = require("../helpers/responseHelper");
const path = require("path");
const fs = require("fs");
const Coupon = require("../models/Coupon");
const Test = require("../models/Test");
const { baseFileUrl } = require("../utils/constant");

exports.list = async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // Fetch paginated results and total count
    const [results, total] = await Promise.all([
      Coupon.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Coupon.countDocuments({}),
    ]);
    return paginationResponse(
      res,
      results,
      "Fetch data successfully.",
      page,
      limit,
      total
    );
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while fetching coupon.");
  }
};

exports.activeList = async (req, res) => {
  try {
    let results = await Coupon.find({}).select({ name: 1 });
    results = results.map((item) => ({
      value: item._id,
      label: item.name,
    }));
    return successResponse(res, results, "Fetch data successfully.");
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while fetching coupon.");
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const testExists = await Test.findOne({ coupon: id });
    if (testExists) {
      return errorResponse(res, "Please delete the associated tests first.");
    }

    const coupon = await Coupon.findById(id);
    const icon = coupon.icon;

    const deletedDoc = await Coupon.findByIdAndDelete(id);
    return successResponse(res, deletedDoc, "Coupon deleted successfully");
  } catch (err) {
    return errorResponse(res, "Error deletion coupon", err.message);
  }
};

exports.couponUpsert = async (req, res) => {
  try {
    const {
      _id = null,
      code,
      type,
      value,
      minAmount,
      maxAmount,
      upTo,
      expiryDate,
      usageCount,
      maxUsers,
      allowedUsers = null,
    } = req.body;
    // console.log("allowedUsers", allowedUsers);
    const rowData = {
      code,
      type,
      value,
      minAmount,
      maxAmount,
      upTo,
      expiryDate,
      usageCount,
      maxUsers,
      allowedUsers,
    };
    if (_id) {
      savedCoupon = await Coupon.findByIdAndUpdate(_id, rowData, { new: true });
    } else {
      const coupon = new Coupon(rowData);
      savedCoupon = await coupon.save();
    }
    return successResponse(
      res,
      savedCoupon,
      `Coupon ${_id ? "updated" : "created"} successfully`
    );
  } catch (error) {
    // logErrorToFile(error);
    return errorResponse(res, "Error creating coupon", error);
  }
};

exports.getCouponById = async (req, res) => {
  const { id } = req.params;
  try {
    // Perform the soft delete
    let coupon = await Coupon.findById(id);

    if (!coupon) {
      return errorResponse(res, "Coupon not found");
    }
    return successResponse(res, coupon, "Coupon fetch successfully");
  } catch (err) {
    return errorResponse(res, "Error fetching coupon", err.message);
  }
};

exports.verify = async(req,res) =>{
  const { couponCode, cartTotal } = req.body;

  if(!couponCode){
    return errorResponse(res, "Coupon code is required."); 
  }
  if(!cartTotal){
    return errorResponse(res, "All fields required"); 
  }
  const userId = req.user.id;
  let coupon =  await Coupon.findOne({code:couponCode});

  if (!coupon) return errorResponse(res, "Coupon not found");

  if (coupon.expiryDate && new Date() > coupon.expiryDate) {
    return errorResponse(res, "Coupon has expired"); 
    
  }
  // console.log('coupon',coupon)

  if (coupon.maxUsers && coupon.usageCount >= coupon.maxUsers) {
    return errorResponse(res, "Coupon usage limit exceeded"); 
  }

  // Check if user is allowed to use the coupon
  if (coupon.allowedUsers?.length > 0 && !coupon.allowedUsers?.includes(userId)) {
    return errorResponse(res, "User is not allowed to use this coupon"); 
  }

  if (cartTotal < coupon.minAmount) {
    return errorResponse(res, `Minimum cart amount for this coupon is ${coupon.minAmount}`);
  }
  if (coupon.maxAmount && cartTotal > coupon.maxAmount) {
    return errorResponse(res, `Maximum cart amount for this coupon is ${coupon.maxAmount}`);    
  }

  let discount = 0;
  if (coupon.type === "flat") {
    discount = Math.min(coupon.value, cartTotal);
  } else if (coupon.type === "percentage") {
    discount = Math.min((cartTotal * coupon.value) / 100, coupon.upTo);
  }
  
  discount = Math.min(discount, cartTotal);
console.log(discount);
  return successResponse(res,{couponInfo:{
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minAmount: coupon.minAmount,
    maxAmount: coupon.maxAmount,
    expiryDate: coupon.expiryDate,
    usageCount: coupon.usageCount,
    maxUsers: coupon.maxUsers,
    allowedUsers: coupon.allowedUsers,
    isValid: true
  },discountAmount:discount},"Coupon applied successfully")
}
