const express = require("express");
const { validate } = require("../helpers/validatorHelper");
const { createMemberRules, updateMemberRules } = require("../validations/memberRules");
const { store, list } = require("../controllers/memberController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router
.post("/store",verifyToken, createMemberRules, validate, store)
.get("/list",verifyToken, list);

module.exports = router;
