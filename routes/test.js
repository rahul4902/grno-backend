const express = require("express");
const { list, createTest, activeList, deleteTest, getTestById, createOrUpdateTest } = require("../controllers/testController");
const { createTestRules, updateTestRules } = require("../validations/testRules");
const { validate } = require("../helpers/validatorHelper");
const router = express.Router();

router
  .get("/list", list)
  .get("/activeList", activeList)
  .post("/create", createTestRules, validate, createOrUpdateTest)
  .post("/update", updateTestRules, validate, createOrUpdateTest)
  .delete("/:id", deleteTest)
  .get("/:id", getTestById);

module.exports = router;
