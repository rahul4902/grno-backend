const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Banner Schema
const BannerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  image_url: {
    type: String,
    required: false,
  },
  order: {
    type: Number,
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
},{
  timestamps: true // This option adds createdAt and updatedAt fields
});

BannerSchema.statics.softDeleteById = function(id) {
  return this.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
};

// Export Banner Model
const Banner = mongoose.model("Banner", BannerSchema);

module.exports = Banner;
