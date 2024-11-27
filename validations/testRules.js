const { body } = require("express-validator");
const mongoose = require("mongoose");
const Test = require("../models/Test");
const Category = require("../models/Category");
const SampleType = require("../models/SampleType");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const createTestRules = [
  body("package_or_test").notEmpty().withMessage("Package or Test is required"),
  body("code").notEmpty().withMessage("Code is required"),
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .custom(async (value) => {
      const test = await Test.findOne({ name: value });
      if (test) {
        return Promise.reject("Test already exists");
      }
      return true;
    }),  
  body("amount")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      return true;
    })
    .isNumeric()
    .withMessage("Amount must be a number"),
  body("lab_cost")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      return true;
    })
    .isNumeric()
    .withMessage("Lab cost must be a number"),
  body("offer_price")
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      return true;
    })
    .isNumeric()
    .withMessage("Offer price must be a number"),
  body("min_age").isNumeric().withMessage("Min age must be a number"),
  body("details").notEmpty().withMessage("Details are required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("max_age").isNumeric().withMessage("Max age must be a number"),
  // body("parameter").custom((array) => array.length > 1).withMessage("Please select one parameter.").isArray().withMessage("Parameter must be an array"),
  body("tat_time").notEmpty().withMessage("TAT time is required"),
  body("tat_time_duration")
    .notEmpty()
    .withMessage("TAT time duration is required"),
  body("recommended_age").notEmpty().withMessage("Recommended age is required"),
  body("status").isBoolean().withMessage("Status must be a boolean"),
  body("category")
    .custom(async (value) => {
      if (value) {
        const category = await Category.findById(value);
        if (!category) {
          return Promise.reject("Invalid category id");
        }
        return true;
      }
    })
    .isMongoId()
    .withMessage("Invalid country ID")
    .notEmpty()
    .withMessage("Category is required"),
  body("recommended_gender")
    .isIn(["male", "female", "both"])
    .withMessage("Invalid recommended gender"),
  body("discount").isNumeric().withMessage("Discount must be a number"),
  body("fasting_time").notEmpty().withMessage("Fasting time is required"),
  body("package_price")
    .isNumeric()
    .withMessage("Package price must be a number"),
  body("smart_report_available")
    .isBoolean()
    .withMessage("Smart report availability must be a boolean"),
  body("sample_types")
    .isArray({ min: 1 })
    .withMessage("Please select one Sample types.")
    .custom(async (values) => {
      // Check if all IDs are valid MongoDB ObjectIDs
      for (let value of values) {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("Sample type not exist.");
        }
      }

      // Check if all IDs exist in the SampleType model
      const sampleTypes = await SampleType.find({ _id: { $in: values } });
      if (sampleTypes.length !== values.length) {
        throw new Error("Please select valid sample type.");
      }

      return true;
    }),
  body("sample_1h_interval_3times")
    .isBoolean()
    .withMessage("Sample 1h interval 3 times must be a boolean"),
  body("sample_1h_interval_2times")
    .isBoolean()
    .withMessage("Sample 1h interval 2 times must be a boolean"),
  body("sample_2h_interval_1time")
    .isBoolean()
    .withMessage("Sample 2h interval 1 time must be a boolean"),
  body("sample_20m_interval_3times")
    .isBoolean()
    .withMessage("Sample 20m interval 3 times must be a boolean"),
  body("test_criteria").isArray().withMessage("Test criteria must be an array"),
  body("home_collection")
    .isBoolean()
    .withMessage("Home collection must be a boolean"),
  body("related_tests")
    .isArray()
    .withMessage("Related packages must be an array")
    .custom((values) => {
      for (let value of values) {
        if (!isValidObjectId(value)) {
          throw new Error("Invalid Related Package ID");
        }
      }
      return true;
    }),
  body("also_known_as")
    .optional()
    .isString()
    .withMessage("Also known as must be a string"),
  body("qna").isArray().withMessage("QnA must be an array"),
  body("is_hiv_form").isBoolean().withMessage("Is HIV form must be a boolean"),
  body("tags").isArray().withMessage("Tags must be an array of strings"),
  body("content").optional().isString().withMessage("Content must be a string"),
  body("package_alias")
    .isArray()
    .withMessage("Package alias must be an array of strings"),
];

const updateTestRules = [
  body("package_or_test").optional().notEmpty().withMessage("Package or Test is required"),
  body("code").optional().notEmpty().withMessage("Code is required"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name is required"),    
  body("amount")
    .optional()
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      return true;
    })
    .isNumeric()
    .withMessage("Amount must be a number"),
  body("lab_cost")
    .optional()
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      return true;
    })
    .isNumeric()
    .withMessage("Lab cost must be a number"),
  body("offer_price")
    .optional()
    .custom((value) => {
      if (value <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      return true;
    })
    .isNumeric()
    .withMessage("Offer price must be a number"),
  body("min_age").optional().isNumeric().withMessage("Min age must be a number"),
  body("details").optional().notEmpty().withMessage("Details are required"),
  body("description").optional().notEmpty().withMessage("Description is required"),
  body("max_age").optional().isNumeric().withMessage("Max age must be a number"),
  // body("parameter").optional().isArray().withMessage("Parameter must be an array").custom((array) => array.length > 0).withMessage("Please select one parameter."),
  body("tat_time").optional().notEmpty().withMessage("TAT time is required"),
  body("tat_time_duration")
    .optional()
    .notEmpty()
    .withMessage("TAT time duration is required"),
  body("recommended_age").optional().notEmpty().withMessage("Recommended age is required"),
  body("status").optional().isBoolean().withMessage("Status must be a boolean"),
  body("category")
    .optional()
    .custom(async (value) => {
      if (value) {
        const category = await Category.findById(value);
        if (!category) {
          return Promise.reject("Invalid category ID");
        }
        return true;
      }
    })
    .isMongoId()
    .withMessage("Invalid category ID"),
  body("recommended_gender")
    .optional()
    .isIn(["male", "female", "both"])
    .withMessage("Invalid recommended gender"),
  body("discount").optional().isNumeric().withMessage("Discount must be a number"),
  body("fasting_time").optional().notEmpty().withMessage("Fasting time is required"),
  body("package_price")
    .optional()
    .isNumeric()
    .withMessage("Package price must be a number"),
  body("smart_report_available")
    .optional()
    .isBoolean()
    .withMessage("Smart report availability must be a boolean"),
  body("sample_types")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Please select one Sample types.")
    .custom(async (values) => {
      for (let value of values) {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("Sample type not exist.");
        }
      }
      const sampleTypes = await SampleType.find({ _id: { $in: values } });
      if (sampleTypes.length !== values.length) {
        throw new Error("Please select valid sample type.");
      }
      return true;
    }),
  body("sample_1h_interval_3times")
    .optional()
    .isBoolean()
    .withMessage("Sample 1h interval 3 times must be a boolean"),
  body("sample_1h_interval_2times")
    .optional()
    .isBoolean()
    .withMessage("Sample 1h interval 2 times must be a boolean"),
  body("sample_2h_interval_1time")
    .optional()
    .isBoolean()
    .withMessage("Sample 2h interval 1 time must be a boolean"),
  body("sample_20m_interval_3times")
    .optional()
    .isBoolean()
    .withMessage("Sample 20m interval 3 times must be a boolean"),
  body("test_criteria").optional().isArray().withMessage("Test criteria must be an array"),
  body("home_collection")
    .optional()
    .isBoolean()
    .withMessage("Home collection must be a boolean"),
  body("related_tests")
    .optional()
    .isArray()
    .withMessage("Related packages must be an array")
    .custom((values) => {
      for (let value of values) {
        if (!isValidObjectId(value)) {
          throw new Error("Invalid Related Package ID");
        }
      }
      return true;
    }),
  body("also_known_as")
    .optional()
    .isString()
    .withMessage("Also known as must be a string"),
  body("qna").optional().isArray().withMessage("QnA must be an array"),
  body("is_hiv_form").optional().isBoolean().withMessage("Is HIV form must be a boolean"),
  body("tags").optional().isArray().withMessage("Tags must be an array of strings"),
  body("content").optional().isString().withMessage("Content must be a string"),
  body("package_alias")
    .optional()
    .isArray()
    .withMessage("Package alias must be an array of strings"),
];

module.exports = {
  createTestRules,updateTestRules
};
