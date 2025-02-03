const express = require("express");
const {save, list} = require("../controllers/contactController");
const verifyToken = require("../middleware/verifyToken");
const { validate } = require("../helpers/validatorHelper");
const { contactRules } = require("../validations/contactRules");
const router = express.Router();

router.post("/",contactRules, validate, save)
.get("/",verifyToken, list);


module.exports = router;
