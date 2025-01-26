const User = require("../models/User");
const { errorResponse, successResponse } = require("../helpers/responseHelper");
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");

const placeOrder = async (req, res) => {
  const {
    items,
    address,
    coupon,
    patient,
    paymentType,
    cartPriceToPay,
    couponDiscount,
    getCartTotalPrice,
  } = req.body;
  if (!req?.user?.id) {
    return errorResponse(res, "User id not found.");
  }

  try {
    const orderPayload = {
      user: req.user.id,
      tests: items,
      member: patient,
      address: address,
      paymentType: paymentType,
      totalAmount: cartPriceToPay,
      discount: 0,
      couponDiscount: couponDiscount,
      coupon: coupon,
      offerAmount: getCartTotalPrice,
    };
    const order = new Order(orderPayload);
    orderData = await order.save();

    return successResponse(res, orderData, "Order place successfully.");
  } catch (error) {
    return errorResponse(res, error.message, error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderId: id }).populate("member");
    return successResponse(res, order, "Order info fetch successfully");
  } catch (error) {
    return errorResponse(res, error.message, error); 
  }
};

module.exports = { placeOrder, getOrderById };
