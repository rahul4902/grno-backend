const {
  successResponse,
  errorResponse,
  paginationResponse,
} = require("../helpers/responseHelper");
const Test = require("../models/Test");
const TestCriteria = require("../models/TestCriteria");
const QnA = require("../models/QnA");
const { slugifyText } = require("../helpers/commonHelper");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { baseFileUrl } = require("../utils/constant");

exports.list = async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // { isDeleted: false }
    // Fetch paginated results and total count
    const [results, total] = await Promise.all([
      Test.find({})
        .populate([{ path: "category", select: { name: 1 } }])
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Test.countDocuments({}),
    ]);

    return paginationResponse(
      res,
      results,
      "Fetch data successfully.",
      page,
      limit,
      total
    );
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while searching.");
  }
};

exports.activeList = async (req, res) => {
  try {
    let tests = await Test.find({}).select({ name: 1 });
    tests = tests.map((item) => ({
      value: item._id,
      label: item.name,
    }));
    return successResponse(res, tests, "Fetch data successfully.");
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while searching.");
  }
};

exports.createTest = async (req, res) => {
  let { type } = req.query;
  try {
    const {
      _id = null,
      package_or_test,
      code,
      name,
      amount,
      leb_cost,
      offer_price,
      min_age,
      details,
      description,
      max_age,
      parameter,
      tat_time,
      tat_time_duration,
      recommended_age,
      status,
      category,
      recommended_gender,
      discount,
      fasting_time,
      package_price,
      smart_report_available,
      sample_types,
      sample_1h_interval_3times,
      sample_1h_interval_2times,
      sample_2h_interval_1time,
      sample_20m_interval_3times,
      test_criteria,
      home_collection,
      meta_keyword,
      related_tests,
      package_tests,
      also_known_as,
      qna,
      sample_report,
      sample_report_pdf,
      is_hiv_form,
      tags,
      type,
      content,
      package_alias,
      lab_cost,
    } = req.body;
    const slug = await slugifyText(name);
    let rowData = {
      package_or_test,
      code,
      name,
      slug,
      amount,
      leb_cost,
      offer_price,
      min_age,
      details,
      description,
      max_age,
      parameter,
      tat_time,
      tat_time_duration,
      recommended_age,
      status,
      category,
      recommended_gender,
      discount,
      fasting_time,
      package_price,
      smart_report_available,
      sample_types,
      sample_1h_interval_3times,
      sample_1h_interval_2times,
      sample_2h_interval_1time,
      sample_20m_interval_3times,
      home_collection,
      meta_keyword,
      related_tests,
      package_tests,
      also_known_as,
      sample_report,
      sample_report_pdf,
      is_hiv_form,
      tags,
      type,
      content,
      package_alias,
      lab_cost,
    };
    if (_id) {
      const test = new Test(rowData);
    }

    const savedTest = await test.save();
    if (test_criteria && test_criteria.length > 0) {
      // 2. Create and save the associated TestCriteria
      const testCriteriaData = test_criteria.map(({ _id, ...criteria }) => ({
        ...criteria,
        test: savedTest._id, // Link the criteria to the saved test
      }));

      const testCriteriaDocuments = await TestCriteria.insertMany(
        testCriteriaData
      );
      savedTest.test_criteria = testCriteriaDocuments.map(
        (criteria) => criteria._id
      );
      await savedTest.save();
    } else {
      await TestCriteria.deleteMany({ test: savedTest._id });
      savedTest.test_criteria = [];
      await savedTest.save();
    }

    if (qna && qna.length > 0) {
      const testQnaData = qna?.map(({ _id, ...qnaItem }) => ({
        ...qnaItem,
        test: savedTest._id, // Link the criteria to the saved test
      }));
      const testQnaDocuments = await QnA.insertMany(testQnaData);
      savedTest.qna = testQnaDocuments.map((qna_item) => qna_item._id);
      await savedTest.save();
    } else {
      await QnA.deleteMany({ test: savedTest._id });
      savedTest.qna = [];
      await savedTest.save();
    }

    return successResponse(res, test, "Test created successfully");
  } catch (error) {
    // logErrorToFile(error);
    return errorResponse(res, "Error creating test", error);
  }
};

exports.createOrUpdateTest = async (req, res) => {
  try {
    const {
      _id = null,
      package_or_test,
      code,
      name,
      amount,
      leb_cost,
      offer_price,
      min_age,
      details,
      description,
      max_age,
      parameter,
      tat_time,
      tat_time_duration,
      recommended_age,
      status,
      category,
      recommended_gender,
      discount,
      fasting_time,
      package_price,
      smart_report_available,
      sample_types,
      sample_1h_interval_3times,
      sample_1h_interval_2times,
      sample_2h_interval_1time,
      sample_20m_interval_3times,
      test_criteria,
      home_collection,
      meta_keyword,
      related_tests,
      package_tests,
      also_known_as,
      qna,
      sample_report,
      sample_report_pdf,
      is_hiv_form,
      tags,
      type,
      content,
      package_alias,
      lab_cost,
    } = req.body;
    const slug = await slugifyText(name);
    let rowData = {
      package_or_test,
      code,
      name,
      slug,
      amount,
      leb_cost,
      offer_price,
      min_age,
      details,
      description,
      max_age,
      parameter,
      tat_time,
      tat_time_duration,
      recommended_age,
      status,
      category,
      recommended_gender,
      discount,
      fasting_time,
      package_price,
      smart_report_available,
      sample_types,
      sample_1h_interval_3times,
      sample_1h_interval_2times,
      sample_2h_interval_1time,
      sample_20m_interval_3times,
      home_collection,
      meta_keyword,
      related_tests,
      package_tests,
      also_known_as,
      sample_report,
      sample_report_pdf,
      is_hiv_form,
      tags,
      type,
      content,
      package_alias,
      lab_cost,
    };
    let savedTest;

    if (_id) {
      savedTest = await Test.findByIdAndUpdate(_id, rowData, { new: true });
    } else {
      const test = new Test(rowData);
      savedTest = await test.save();
    }

    if (test_criteria && test_criteria.length > 0) {
      await TestCriteria.deleteMany({ test: savedTest._id });
      const testCriteriaData = test_criteria.map(({ _id, ...criteria }) => ({
        ...criteria,
        test: savedTest._id, // Link the criteria to the saved test
      }));
      const testCriteriaDocuments = await TestCriteria.insertMany(
        testCriteriaData
      );
      savedTest.test_criteria = testCriteriaDocuments.map(
        (criteria) => criteria._id
      );
    } else {
      await TestCriteria.deleteMany({ test: savedTest._id });
      savedTest.test_criteria = [];
    }

    if (qna && qna.length > 0) {
      await QnA.deleteMany({ test: savedTest._id });
      const testQnaData = qna.map(({ _id, ...qnaItem }) => ({
        ...qnaItem,
        test: savedTest._id, // Link the QnA to the saved test
      }));
      const testQnaDocuments = await QnA.insertMany(testQnaData);
      savedTest.qna = testQnaDocuments.map((qna_item) => qna_item._id);
    } else {
      await QnA.deleteMany({ test: savedTest._id });
      savedTest.qna = [];
    }

    await savedTest.save();

    return successResponse(res, savedTest, "Test updated successfully");
  } catch (error) {
    // logErrorToFile(error);
    return errorResponse(res, "Error updating test", error);
  }
};

exports.deleteTest = async (req, res) => {
  const { id } = req.params;
  try {
    // Perform the soft delete
    const deletedDoc = await Test.softDeleteById(id);

    if (!deletedDoc) {
      return errorResponse(res, "Test not found");
    }
    return successResponse(res, deletedDoc, "Test deleted successfully");
  } catch (err) {
    return errorResponse(res, "Error creating test", err.message);
  }
};
exports.getTestById = async (req, res) => {
  const { id } = req.params;
  try {
    // Perform the soft delete
    let test = await Test.findById(id).populate([
      { path: "qna", select: { question: 1, answer: 1 } },
      { path: "test_criteria" },
    ]);

    if (!test) {
      return errorResponse(res, "Test not found");
    }
    return successResponse(res, test, "Test fetch successfully");
  } catch (err) {
    return errorResponse(res, "Error fetching test", err.message);
  }
};

exports.importTest = async (req, res) => {
  try {
    let file = null;
    if (req.files) {
      file = req.files["file"];
    }
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const extension = path.extname(file.name);
    if (extension !== ".csv") {
      return res.status(400).json({ message: "Please upload a CSV file" });
    }

    let fileName = "";
    let fileUrl = "";
    if (file) {
      const extension = path.extname(file.name);
      fileName = `${Date.now()}${extension}`;
      const uploadPath = path.join(__dirname, `../uploads/category/`);

      // Call your image compression function
      await fs.promises.writeFile(path.join(uploadPath, fileName), file.data);

      // Step 3: Set the file URL (this should be the URL where the file will be served from)
      fileUrl = `${baseFileUrl}category/${fileName}`;
    }

    const tempFilePath = path.join(__dirname, "uploaded-file.csv");
    await fs.promises.writeFile(tempFilePath, file.data);

    const results = [];

    const parseCSV = new Promise((resolve, reject) => {
      const fileStream = fs.createReadStream(tempFilePath);
      fileStream
        .pipe(csv()) // Parse the CSV data
        .on("data", (data) => {
          results.push(data); // Collect each row from the CSV
        })
        .on("end", async () => {
          // Step 6: Log the parsed data
          console.log("Parsed CSV Data:", results);

          // Clean up the temporary file after processing
          await fs.promises.unlink(tempFilePath);

          resolve(results);
        })
        .on("error", async (err) => {
          // Clean up on error
          await fs.promises.unlink(tempFilePath);
          reject(new Error("Failed to process CSV file: " + err.message));
        });
    });

    // Await for CSV parsing to complete
    const tests = await parseCSV;
    if (!Array.isArray(tests)) {
      return errorResponse(res, "No data received.");
    }
    
    const processedTests = tests.map(test => ({
      ...test,
      is_hiv_form: test.is_hiv_form === "TRUE" ? true : false,
      home_collection: test.home_collection === "TRUE" ? true : false,
      sample_20m_interval_3times: test.sample_20m_interval_3times === "TRUE" ? true : false,
      smart_report_available: test.smart_report_available === "TRUE" ? true : false,
      sample_1h_interval_3times: test.sample_1h_interval_3times === "TRUE" ? true : false,
      sample_1h_interval_2times: test.sample_1h_interval_2times === "TRUE" ? true : false,
      sample_2h_interval_1time: test.sample_2h_interval_1time === "TRUE" ? true : false,
      sample_20m_interval_3times: test.sample_20m_interval_3times === "TRUE" ? true : false,
      sample_20m_interval_3times: test.sample_20m_interval_3times === "TRUE" ? true : false,
    }));

    const hasInvalid = processedTests.some((test) => !test.slug);
    if (hasInvalid) {
      return errorResponse(res, 'Each test must include "code" and "slug"');
    }

    const bulkOps = processedTests.map((test) => ({
      updateOne: {
        filter: { slug: test.slug },
        update: { $set: test },
        upsert: true,
      },
    }));

    const result = await Test.bulkWrite(bulkOps);

    return successResponse(res, {
      insertedCount: result.nUpserted,
      updatedCount: result.nModified,
    },"Bulk upsert completed successfully");
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
