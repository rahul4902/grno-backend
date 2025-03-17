const { errorResponse, successResponse } = require("../helpers/responseHelper");

const search = async (req, res) => {
  const query = req.query.query;
  const type = req.query.type || "test";
  const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
  const page = parseInt(req.query.page) || 1; // Default to page 1

  // Ensure query is provided
  if (!query) {
    return errorResponse(res, "Query parameter is required.");
  }

  // Construct the search condition dynamically
  let where = {
    $or: [
      { name: { $regex: new RegExp(query, "i") } }, // Use dynamic query
    ],
  };

  if (type) {
    where.package_or_test = type;
  }

  try {
    // Debugging: Log the final query to check correctness
    console.log("Search filter:", JSON.stringify(where, null, 2));

    // Fetch results and total count in parallel
    const [results, totalCount] = await Promise.all([
      Test.find(where)
        .limit(limit)
        .skip((page - 1) * limit),
      Test.countDocuments(where),
    ]);

    const hasMore = page * limit < totalCount;

    return successResponse(
      res,
      { data: results, hasMore },
      "Fetched data successfully."
    );
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while searching.");
  }
};

module.exports = { search };
