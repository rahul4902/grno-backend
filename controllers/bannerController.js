const { compressImage } = require("../helpers/compressHelper");
const {
  successResponse,
  errorResponse,
  paginationResponse,
} = require("../helpers/responseHelper");
const path = require("path");
const fs= require("fs");
const Banner = require("../models/Banner");
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
      Banner.find({isDeleted:false}).skip(skip).limit(limit).sort({createdAt:-1}),
      Banner.countDocuments({}),
    ]);
    return paginationResponse(res,results,"Fetch data successfully.",page,limit,total);
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while fetching banner.");
  }
};

exports.activeList = async (req, res) => {
  try {
    let results = await Banner.find({isDeleted:false});
    return successResponse(res, results, "Fetch data successfully.");
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while fetching banner.");
  }
};


exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const testExists = await Test.findOne({ banner: id });
    if (testExists) {
      return errorResponse(res, "Please delete the associated tests first.");
    }

    const banner = await Banner.findById(id);
    const image = banner.image;
    
    const deletedDoc = await Banner.softDeleteById(id);
    if (!deletedDoc) {
      return errorResponse(res, "Banner not found");
    }
    if(image){
      // if(fs.existsSync(`./uploads/banner/${image}`)){
      //   fs.unlink(`./uploads/banner/${image}`, (err) => {
      //     if (err) {
      //       return errorResponse(res, 'Error deleting file:', err);
      //     }
      //   });
      // }
    }
    return successResponse(res, deletedDoc, "Banner deleted successfully");
  } catch (err) {
    return errorResponse(res, "Error deleteing banner", err.message);
  }
};


exports.bannerUpsert = async (req, res) => {
  try {
    const { _id=null,name, status, order} = req.body;
    let file = null;
    if (req.files) {
      file = req.files["image"];
    }
    //if (!file) return errorResponse(res, "Banner Image is required");

    let fileName = "";
    let fileUrl = "";
    if(file){
      const extension = path.extname(file.name);
      fileName = `${Date.now()}${extension}`;    
      const bannerPath = path.join(__dirname, `../uploads/banner/`);
      const bannerImageResponse = await compressImage(file,100,750,bannerPath,fileName);
      if (bannerImageResponse.status == 400){
        return errorResponse(res, bannerImageResponse.message);
      }
      fileUrl = `${baseFileUrl}banner/${fileName}`;
    }
    
    const rowData = {name,status,image: fileName,image_url: fileUrl,order};    
    if (_id) {
      savedBanner = await Banner.findByIdAndUpdate(_id, rowData, { new: true });
    } else {
      const banner = new Banner(rowData);
      savedBanner = await banner.save();
    }
    return successResponse(res, savedBanner, `Banner ${_id?'updated':'created'} successfully`);
  } catch (error) {
    // logErrorToFile(error);
    return errorResponse(res, "Error creating banner", error);
  }
};

exports.getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    // Perform the soft delete
    let banner = await Banner.findById(id);

    if (!banner) {
      return errorResponse(res, "Banner not found");
    }
    return successResponse(res, banner, "Banner fetch successfully");
  } catch (err) {
    return errorResponse(res, "Error fetching banner", err.message);
  }
};
