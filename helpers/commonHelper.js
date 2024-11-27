const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const uuid = require("uuid");

const slugifyText = async (value) => {
  return slugify(value, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: false,
    locale: "vi",
    trim: true,
  });
};

const validateObjectId = async (id) =>
  mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;

function logErrorToFile(error) {
  const logFilePath = path.join(__dirname, "/logs/errorlog.log"); // Assuming script.js is in the 'app' folder
  console.log("Log file path:", logFilePath); // Debugging statement
  const errorMessage = `[${new Date().toISOString()}] ${
    error.stack || error
  }\n`;
  console.log("Error message:", errorMessage); // Debugging statement

  fs.appendFile(logFilePath, errorMessage, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    } else {
      console.log("Error logged successfully."); // Debugging statement
    }
  });
}



module.exports = { slugifyText, validateObjectId, logErrorToFile };
