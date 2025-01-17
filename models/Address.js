const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assumes you have a User model to associate the address with a user
    },
    address1: {
      type: String,
    },
    address2: {
      type: String,
      required: false,
    },
    houseNo: {
      type: String,
    },
    locality: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    landmark: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: true,
    },
    isBillingAddress: {
      type: Boolean,
      default: false, // Used to specify whether this address is a billing address
    },
    isShippingAddress: {
      type: Boolean,
      default: false, // Used to specify whether this address is for shipping
    },
    isPrimary: {
      type: Boolean,
      default: false, // Used to specify whether this address is for shipping
    },
    addressType: {
      type: String,
      enum: ["home", "office", "warehouse", "other"], // Address type (home, office, etc.)
      default: "home",
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
