const express = require("express");
const { placeOrder, getOrderById } = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/", verifyToken, placeOrder);
router.get("/:id", verifyToken,getOrderById);

module.exports = router;
