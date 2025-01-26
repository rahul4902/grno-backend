const express = require("express");
const {
  list,
  activeList,
  deleteItem,
  getBannerById,
  bannerUpsert,
} = require("../controllers/bannerController");
const { validate } = require("../helpers/validatorHelper");
const { createBannerRules, updateBannerRules } = require("../validations/bannerRules");
const router = express.Router();

router
  .get("/activeList", activeList)
  .get("/list", list)
  .post("/create", createBannerRules, validate, bannerUpsert)
  .post("/update", updateBannerRules, validate, bannerUpsert)
  .delete("/:id", deleteItem)
  .get("/:id", getBannerById);


module.exports = router;
