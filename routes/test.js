const express = require("express");
const { list, createTest, activeList, deleteTest, getTestById, createOrUpdateTest, importTest } = require("../controllers/testController");
const { createTestRules, updateTestRules } = require("../validations/testRules");
const { validate } = require("../helpers/validatorHelper");
const router = express.Router();

router
  .get("/list", list)
  .get("/activeList", activeList)
  .post("/create", createTestRules, validate, createOrUpdateTest)
  .post("/update", updateTestRules, validate, createOrUpdateTest)
  .post("/import",  importTest)
  .delete("/:id", deleteTest)
  .get("/:id", getTestById);

module.exports = router;
