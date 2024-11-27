const { successResponse, errorResponse } = require("../helpers/responseHelper");
const QNA = require("../models/QnA");
const ObjectId = require("mongodb").ObjectId;

const list = async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // Fetch paginated results and total count
    const [results, total] = await Promise.all([
      QNA.find({}).skip(skip).limit(limit),
      QNA.countDocuments({}),
    ]);

    // Prepare pagination metadata
    const pagination = {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      itemsPerPage: limit,
    };

    return successResponse(
      res,
      { results, pagination },
      "Fetch data successfully."
    );
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while searching.");
  }
};

const listByTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const objectTestId = new ObjectId(testId);
    console.log('objectTestId',objectTestId)
    let questions = await QNA.find({ test: objectTestId });
    return successResponse(res, questions, "Fetch data successfully.");
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while searching.");
  }
};

module.exports = { list, listByTest };
