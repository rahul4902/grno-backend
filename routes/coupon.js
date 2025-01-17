const express = require("express");
const {
  list,
  activeList,
  deleteItem,
  getCouponById,
  couponUpsert,
  verify
} = require("../controllers/couponController");
const verifyToken = require("../middleware/verifyToken");
const { validate } = require("../helpers/validatorHelper");
const { createCouponRules, updateCouponRules } = require("../validations/couponRules");
const router = express.Router();

router
  .get("/activeList", activeList)
  .get("/list", list)
  .post("/create", createCouponRules, validate, couponUpsert)
  .post("/update", updateCouponRules, validate, couponUpsert)
  .delete("/:id", deleteItem)
  .get("/:id", getCouponById)
  .post("/verify",verifyToken, verify);


module.exports = router;
