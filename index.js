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
const userRoutes = require("./routes/user");
const addressRoutes = require("./routes/address");
const categoryRoutes = require("./routes/category");
const bannerRoutes = require("./routes/banner");
const couponRoutes = require("./routes/coupon");
const qnaRoutes = require("./routes/qna");
const sampleTypeRoutes = require("./routes/sampleType");
const testCriteriaRoutes = require("./routes/testCriteria");
const contactRoutes = require("./routes/contact");
const orderRoutes = require("./routes/order");
const { successResponse, errorResponse } = require("./helpers/responseHelper");

// Use routes
app.use("/api/contact",contactRoutes );
app.use("/api/auth", authRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/users", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/orders", orderRoutes);
// admin
app.use("/api/test", testRoutes);
app.use("/category", categoryRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/qna", qnaRoutes);
app.use("/sampleType", sampleTypeRoutes);
app.use("/testCriteria", testCriteriaRoutes);

app.get("/search", async (req, res) => {
  const query = req.query.query;
  const type = req.query.type || "test";
  const limit = parseInt(req.query.limit) || 10;  // Default to 10 records per page
  const page = parseInt(req.query.page) || 1;     // Default to page 1

  // Ensure query is provided
  if (!query) {
    return errorResponse(res, "Query parameter is required.");
  }

  // Construct the search condition dynamically
  let where = {
    $or: [
      { name: { $regex: new RegExp(query, "i") } } // Use dynamic query
    ]
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
      Test.countDocuments(where)
    ]);

    const hasMore = page * limit < totalCount;

    return successResponse(res, { data: results, hasMore }, "Fetched data successfully.");
  } catch (err) {
    console.error("Error occurred while searching:", err);
    return errorResponse(res, "An error occurred while searching.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
