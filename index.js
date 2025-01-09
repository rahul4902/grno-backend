const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Test = require("./models/Test");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://rahul123:rahul123@cluster0.mxwls6m.mongodb.net/greno?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors(['*','192.168.1.6']));
app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024,
      useTempFiles: true,
      tempFileDir: "/tmp/",
    },
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Import routes
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const memberRoutes = require("./routes/member");
const categoryRoutes = require("./routes/category");
const qnaRoutes = require("./routes/qna");
const sampleTypeRoutes = require("./routes/sampleType");
const testCriteriaRoutes = require("./routes/testCriteria");
const { successResponse, errorResponse } = require("./helpers/responseHelper");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
// admin
app.use("/test", testRoutes);
app.use("/category", categoryRoutes);
app.use("/qna", qnaRoutes);
app.use("/sampleType", sampleTypeRoutes);
app.use("/testCriteria", testCriteriaRoutes);

app.get("/search", async (req, res) => {
  const query = req.query.query;
  const type = req.query.type;
  const limit = parseInt(req.query.limit) || 2;  // Default to 4 if not specified
  const page = parseInt(req.query.page) || 2;    // Default to 1 if not specified

  let where = {
    name: { $regex: new RegExp(query, "i") },
  };

  if (type) {
    where.package_or_test = type;
  }

  if (!query) {
    return errorResponse(res, "Query parameter is required.");
  }

  try {
    // Apply pagination with limit and skip
    const results = await Test.find(where)
      .limit(limit)
      .skip((page - 1) * limit);

    // Check if there are more results
    const totalCount = await Test.countDocuments(where);
    const hasMore = page * limit < totalCount;

    return successResponse(res, { data: results, hasMore }, "Fetch data successfully.");
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while searching.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
