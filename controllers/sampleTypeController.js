const { successResponse, errorResponse, paginationResponse } = require("../helpers/responseHelper");
const SampleType = require("../models/SampleType");
const Test = require("../models/Test");




exports.list = async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // Fetch paginated results and total count
    const [results, total] = await Promise.all([
      SampleType.find({}).skip(skip).limit(limit).sort({createdAt:-1}),
      SampleType.countDocuments({}),
    ]);
    return paginationResponse(res,results,"Fetch data successfully.",page,limit,total);
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while fetching sample types.");
  }
};
exports.activeList = async (req, res) => {
  try {
    // Get page and limit from query parameters
    let sampleList = await SampleType.find({}).select({ _id: 1, name: 1 });
    sampleList = sampleList.map((item) => ({
      value: item._id,
      label: item.name,
    }));
    return successResponse(res, sampleList, "Fetch data successfully.");
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while searching.");
  }
};


exports.sampleTypeUpsert = async (req, res) => {
  try {
    const { _id=null,name, status} = req.body;  
    const rowData = {name,status};    
    let savedSampleType;
    if (_id) {
      savedSampleType = await SampleType.findByIdAndUpdate(_id, rowData, { new: true });
    } else {
      const sampleType = new SampleType(rowData);
      savedSampleType = await sampleType.save();
    }
    return successResponse(res, savedSampleType, `SampleType ${ _id ? 'updated' : 'created' } successfully`);
  } catch (error) {
    // logErrorToFile(error);
    return errorResponse(res, "Error creating sample type", error);
  }
};


exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const testExists = await Test.findOne({ sampleType: id });
    if (testExists) {
      return errorResponse(res, "Please delete the associated tests first.");
    }
    
    const deletedDoc = await SampleType.softDeleteById(id);
    if (!deletedDoc) {
      return errorResponse(res, "Sample Type not found");
    }
    return successResponse(res, deletedDoc, "Sample Type deleted successfully");
  } catch (err) {
    return errorResponse(res, "Error deleting sample type", err.message);
  }
};


exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    // Perform the soft delete
    let sampleType = await SampleType.findById(id);
    if (!sampleType) {
      return errorResponse(res, "Sample type not found");
    }
    return successResponse(res, sampleType, "Sample type fetch successfully");
  } catch (err) {
    return errorResponse(res, "Error fetching sample type", err.message);
  }
};


