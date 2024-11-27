const { compressImage } = require("../helpers/compressHelper");
const {
  successResponse,
  errorResponse,
  paginationResponse,
} = require("../helpers/responseHelper");
const path = require("path");
const fs= require("fs");
const Category = require("../models/Category");
const Test = require("../models/Test");
const { baseFileUrl } = require("../utils/constant");

exports.list = async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // Fetch paginated results and total count
    const [results, total] = await Promise.all([
      Category.find({}).skip(skip).limit(limit).sort({createdAt:-1}),
      Category.countDocuments({}),
    ]);
    return paginationResponse(res,results,"Fetch data successfully.",page,limit,total);
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while fetching category.");
  }
};

exports.activeList = async (req, res) => {
  try {
    let results = await Category.find({}).select({ name: 1 });
    results = results.map((item) => ({
      value: item._id,
      label: item.name,
    }));
    return successResponse(res, results, "Fetch data successfully.");
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while fetching category.");
  }
};


exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const testExists = await Test.findOne({ category: id });
    if (testExists) {
      return errorResponse(res, "Please delete the associated tests first.");
    }

    const category = await Category.findById(id);
    const icon = category.icon;
    
    const deletedDoc = await Category.softDeleteById(id);
    if (!deletedDoc) {
      return errorResponse(res, "Category not found");
    }
    if(icon){
      // if(fs.existsSync(`./uploads/category/${icon}`)){
      //   fs.unlink(`./uploads/category/${icon}`, (err) => {
      //     if (err) {
      //       return errorResponse(res, 'Error deleting file:', err);
      //     }
      //   });
      // }
    }
    return successResponse(res, deletedDoc, "Category deleted successfully");
  } catch (err) {
    return errorResponse(res, "Error deleteing category", err.message);
  }
};


exports.categoryUpsert = async (req, res) => {
  try {
    const { _id=null,name, status, order} = req.body;
    let file = null;
    if (req.files) {
      file = req.files["icon"];
    }
    //if (!file) return errorResponse(res, "Category Image is required");

    let fileName = "";
    let fileUrl = "";
    if(file){
      const extension = path.extname(file.name);
      fileName = `${Date.now()}${extension}`;    
      const categoryPath = path.join(__dirname, `../uploads/category/`);
      const categoryImageResponse = await compressImage(file,100,750,categoryPath,fileName);
      if (categoryImageResponse.status == 400){
        return errorResponse(res, categoryImageResponse.message);
      }
      fileUrl = `${baseFileUrl}category/${fileName}`;
    }
    
    const rowData = {name,status,icon: fileName,icon_url: fileUrl,order};    
    if (_id) {
      savedCategory = await Category.findByIdAndUpdate(_id, rowData, { new: true });
    } else {
      const category = new Category(rowData);
      savedCategory = await category.save();
    }
    return successResponse(res, savedCategory, `Category ${_id?'updated':'created'} successfully`);
  } catch (error) {
    // logErrorToFile(error);
    return errorResponse(res, "Error creating category", error);
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    // Perform the soft delete
    let category = await Category.findById(id);

    if (!category) {
      return errorResponse(res, "Category not found");
    }
    return successResponse(res, category, "Category fetch successfully");
  } catch (err) {
    return errorResponse(res, "Error fetching category", err.message);
  }
};
