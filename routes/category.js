const express = require("express");
const {
  list,
  activeList,
  deleteItem,
  getCategoryById,
  categoryUpsert,
} = require("../controllers/categoryController");
const { validate } = require("../helpers/validatorHelper");
const { createCategoryRules, updateCategoryRules } = require("../validations/categoryRules");
const router = express.Router();

router
  .get("/activeList", activeList)
  .get("/list", list)
  .post("/create", createCategoryRules, validate, categoryUpsert)
  .post("/update", updateCategoryRules, validate, categoryUpsert)
  .delete("/:id", deleteItem)
  .get("/:id", getCategoryById);


module.exports = router;
