const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sampleTypeSchema = new Schema({
  name: { type: String, required: true },
  status: {
    type: Boolean,
    default: true,
  },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }
});

sampleTypeSchema.statics.softDeleteById = function(id) {
    return this.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
  };

const SampleType = mongoose.model("SampleType", sampleTypeSchema);

module.exports = SampleType;
