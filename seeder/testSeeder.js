const mongoose = require("mongoose");
const Test = require("../models/Test"); // Import Test model

// Database connection
mongoose.connect('mongodb+srv://rahul123:rahul123@cluster0.mxwls6m.mongodb.net/greno?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));
// Sample test data
const tests = [
  {
    package_or_test: "test",
    code: "BC360",
    name: "Kidney Function Test (KFT)",
    slug: "kidney-function-test",
    amount: 300,
    leb_cost: 100,
    offer_price: 399,
    min_age: 5,
    details: "Suggested for patients exhibit...",
    description:
      "(Urea, BUN, Creatinine, BUN/Creatinine Ratio, Uric Acid, Sodium Ratio",
    max_age: 120,
    parameter: [], // Add Mongo Object IDs for parameters
    tat_time: "Within 10 Hrs",
    tat_time_duration: "1 day, 0:00:00",
    recommended_age: "5+ Years",
    status: true,
    category: [new mongoose.Types.ObjectId("669d186e0bc54250391ca7ac")],
    recommended_gender: "both",
    discount: 68,
    fasting_time: "Not Required",
    package_price: 1560,
    smart_report_available: false,
    sample_types: [], // Add Mongo Object IDs for sample types
    sample_1h_interval_3times: false,
    sample_1h_interval_2times: false,
    sample_2h_interval_1time: false,
    sample_20m_interval_3times: false,
    test_criteria: [
      new mongoose.Types.ObjectId("669d1907f418834f63f20476"),
      new mongoose.Types.ObjectId("669d1907f418834f63f20477"),
      new mongoose.Types.ObjectId("669d1907f418834f63f20478"),
    ],
    home_collection: true,
    meta_keyword: "Kidney function test",
    related_tests: [], // Add Mongo Object IDs for related packages
    also_known_as:
      "Renal Profile, Kindey Profile, RFT, KFT, Renal Function Test, Kidney Panel",
    qna: [
      new mongoose.Types.ObjectId("669d18cad0644b441248174d"),
      new mongoose.Types.ObjectId("669d18cad0644b441248174e"),
      new mongoose.Types.ObjectId("669d18cad0644b441248174f"),
      new mongoose.Types.ObjectId("669d18cad0644b4412481750"),
    ],
    sample_report: null,
    sample_report_pdf: null,
    is_hiv_form: false,
    tags: [
      new mongoose.Types.ObjectId("669d18f73cbc10f1f7561cc0"),
      new mongoose.Types.ObjectId("669d18f73cbc10f1f7561cc1"),
      new mongoose.Types.ObjectId("669d18f73cbc10f1f7561cc2"),
    ],
    type: null,
    content: "",
    package_alias: ["Kidney Blood Test"],
  },
];

// Seeder function
async function seedTests() {
  try {
    // Clear existing tests
    await Test.deleteMany({});

    // Insert new tests
    await Test.insertMany(tests);

    console.log("Tests seeded successfully!");
  } catch (err) {
    console.error("Error seeding tests:", err);
  } finally {
    // Close the database connection
    // new mongoose.connection.close();
  }
}

// Run the seeder
seedTests();
