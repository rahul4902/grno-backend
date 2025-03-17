const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Test Schema
const TestSchema = new Schema({
  package_or_test: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  lab_cost: {
    type: Number,
    required: false,
  },
  offer_price: {
    type: Number,
    required: false,
  },
  min_age: {
    type: Number,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  max_age: {
    type: Number,
    required: true,
  },
  parameter: [
    {
      type: String,
    },
  ],
  tat_time: {
    type: String,
    required: true,
  },
  tat_time_duration: {
    type: String,
    required: true,
  },
  recommended_age: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category", // Reference to Category model
  },
  recommended_gender: {
    type: String,
    default: "both",
  },
  discount: {
    type: Number,
    required: true,
  },
  fasting_time: {
    type: String,
    default: "Not Required",
  },
  package_price: {
    type: Number,
    required: true,
  },
  smart_report_available: {
    type: Boolean,
    default: false,
  },
  sample_types: [
    {
      type: Schema.Types.ObjectId,
      ref: "SampleType", // Reference to SampleType model
    },
  ],
  sample_1h_interval_3times: {
    type: Boolean,
    default: false,
  },
  sample_1h_interval_2times: {
    type: Boolean,
    default: false,
  },
  sample_2h_interval_1time: {
    type: Boolean,
    default: false,
  },
  sample_20m_interval_3times: {
    type: Boolean,
    default: false,
  },
  test_criteria: [
    {
      type: Schema.Types.ObjectId,
      ref: "TestCriteria", // Reference to TestCriteria model
    },
  ],
  home_collection: {
    type: Boolean,
    default: false,
  },
  meta_keyword: {
    type: String,
    required: false,
  },
  related_tests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Test", // Reference to RelatedPackage model
    },
  ],
  also_known_as: {
    type: String,
    default: "",
  },
  qna: [
    {
      type: Schema.Types.ObjectId,
      ref: "QnA", // Reference to QnA model
    },
  ],
  sample_report: {
    type: String,
    default: null,
  },
  sample_report_pdf: {
    type: String,
    default: null,
  },
  is_hiv_form: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      type: String,
      default: [],
    },
  ],
  type: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    default: "",
  },
  package_alias: [
    {
      type: String,
      default: [],
    },
  ],
  package_tests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Test", // Reference to RelatedPackage model
    },
  ],
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
},{
  timestamps: true // This option adds createdAt and updatedAt fields
});

TestSchema.statics.softDeleteById = function(id) {
  return this.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
};
// Export Test Model
const Test = mongoose.model("Test", TestSchema);

module.exports = Test;
