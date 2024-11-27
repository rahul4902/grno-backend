const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Category Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
  icon_url: {
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

CategorySchema.statics.softDeleteById = function(id) {
  return this.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
};

// Export Category Model
const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
