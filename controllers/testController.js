const {
  successResponse,
  errorResponse,
  paginationResponse,
} = require("../helpers/responseHelper");
const Test = require("../models/Test");
const TestCriteria = require("../models/TestCriteria");
const QnA = require("../models/QnA");
const { slugifyText } = require("../helpers/commonHelper");

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
        .limit(limit).sort({createdAt:-1}),
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
    let tests = await Test.find({}).select({name:1});
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
  let {type} =  req.query;
  try {
    const {_id=null,package_or_test,code,name,amount,leb_cost,offer_price,min_age,details,description,max_age,parameter,tat_time,tat_time_duration,recommended_age,status,category,recommended_gender,discount,fasting_time,package_price,smart_report_available,sample_types,sample_1h_interval_3times,sample_1h_interval_2times,sample_2h_interval_1time,sample_20m_interval_3times,test_criteria,home_collection,meta_keyword,related_tests,package_tests,also_known_as,qna,sample_report,sample_report_pdf,is_hiv_form,tags,type,content,package_alias,lab_cost,} = req.body;
    const slug = await slugifyText(name);
    let rowData = {package_or_test,code,name,slug,amount,leb_cost,offer_price,min_age,details,description,max_age,parameter,tat_time,tat_time_duration,recommended_age,status,category,recommended_gender,discount,fasting_time,package_price,smart_report_available,sample_types,sample_1h_interval_3times,sample_1h_interval_2times,sample_2h_interval_1time,sample_20m_interval_3times,home_collection,meta_keyword,related_tests,package_tests,also_known_as,sample_report,sample_report_pdf,is_hiv_form,tags,type,content,package_alias,lab_cost};
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
    const {_id=null,package_or_test,code,name,amount,leb_cost,offer_price,min_age,details,description,max_age,parameter,tat_time,tat_time_duration,recommended_age,status,category,recommended_gender,discount,fasting_time,package_price,smart_report_available,sample_types,sample_1h_interval_3times,sample_1h_interval_2times,sample_2h_interval_1time,sample_20m_interval_3times,test_criteria,home_collection,meta_keyword,related_tests,package_tests,also_known_as,qna,sample_report,sample_report_pdf,is_hiv_form,tags,type,content,package_alias,lab_cost,} = req.body;
    const slug = await slugifyText(name);
    let rowData = {package_or_test,code,name,slug,amount,leb_cost,offer_price,min_age,details,description,max_age,parameter,tat_time,tat_time_duration,recommended_age,status,category,recommended_gender,discount,fasting_time,package_price,smart_report_available,sample_types,sample_1h_interval_3times,sample_1h_interval_2times,sample_2h_interval_1time,sample_20m_interval_3times,home_collection,meta_keyword,related_tests,package_tests,also_known_as,sample_report,sample_report_pdf,is_hiv_form,tags,type,content,package_alias,lab_cost};
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
      const testCriteriaDocuments = await TestCriteria.insertMany(testCriteriaData);
      savedTest.test_criteria = testCriteriaDocuments.map((criteria) => criteria._id);
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
