const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['flat', 'percentage'], required: true },
  value: { type: Number, required: true },
  minAmount: { type: Number, default: 0 }, 
  maxAmount: { type: Number }, 
  upTo: { type: Number, default: 0 }, 
  expiryDate: { type: Date, nullable: true }, 
  usageCount: { type: Number, default: 0 }, 
  maxUsers: { type: Number }, 
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId,nullable: true, ref: 'User' }],
  status:{type:Boolean, default:true}, 
},{
    timestamps: true // This option adds createdAt and updatedAt fields
  });

module.exports = mongoose.model('Coupon', couponSchema);
