const {
  successResponse,
  errorResponse,
  paginationResponse,
} = require("../helpers/responseHelper");

const Contact = require("../models/Contact");

exports.save = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    const rowData = {
      name,
      email,
      mobile,
      message,
    };
    const contact = new Contact(rowData);
    savedContact = await contact.save();
    return successResponse(
      res,
      null,
      `Thank you for reaching out! We've received your query and will get back to you soon.`
    );
  } catch (error) {
    // logErrorToFile(error);
    return errorResponse(res, "Error creating contact", error);
  }
};

exports.list = async (req,res) => {
    try {
      const contactsList = await Contact.find({});
      return successResponse(res,contactsList,"contact list successfully.");
    } catch (error) {
      return errorResponse(res, "Error creating contact", error);
    }

}
