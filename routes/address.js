const express = require("express");
const { validate } = require("../helpers/validatorHelper");

const verifyToken = require("../middleware/verifyToken");
const { createAddressRules, updateAddressRules } = require("../validations/addressRules");
const { updateAddress, deleteAddress, store, list } = require("../controllers/addressController");
const router = express.Router();

router
.post("/store",verifyToken, createAddressRules, validate, store)
.put('/update/:id',verifyToken, updateAddressRules, updateAddress)
.delete('/addresses/:id',verifyToken, deleteAddress)
.get("/list",  verifyToken, list);

module.exports = router;
