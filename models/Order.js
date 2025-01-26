const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true }, 
    transactionId: { type: String,unique: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tests: [
      {
        quantity: { type: Number, required: true },
        name: {type: String,required: true},
        amount: { type: Number, required: true },
        offer_price: { type: Number, required: true },
        package_or_test: {type: String,required: true},
        slug: {type: String,required: true},
        _id: { type: mongoose.Schema.Types.ObjectId,required: true,ref: "Test"},
      },
    ],
    member:{ type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    address:{ type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    paymentType: { type: String, enum: ["COD", "Razorpay"], required: true },

    offerAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    coupon: { type: Object, default: null },    
    paymentStatus: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    orderStatus: { type: String, default: "Processing" }
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function (next) {
  const order = this;

  // Only generate orderId for new documents
  if (!order.orderId) {
    const lastOrder = await mongoose.model("Order").findOne({}, { orderId: 1 }).sort({ createdAt: -1 }).exec();
    if (lastOrder && lastOrder.orderId) {
      // Extract the numeric part and increment it
      const lastOrderNumber = parseInt(lastOrder.orderId.split("-")[1], 10);
      order.orderId = `ORD-${(lastOrderNumber + 1).toString().padStart(6, "0")}`; // Increment and format
    } else {
      // If no previous order exists, start from 1
      order.orderId = "ORD-000001";
    }
  }

  // Generate `transactionId` for Razorpay payments
  if (!order.transactionId || order.paymentType === "Razorpay") {
    order.transactionId = `TXN-${Date.now()}${Math.floor(Math.random() * 10000)}`; // Example: TXN-1678912345678-1234
  }

  next();
});
module.exports = mongoose.model("Order", orderSchema);
