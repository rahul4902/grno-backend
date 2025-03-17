const express = require("express");
const { search } = require("../controllers/mainConroller");
const router = express.Router();

router.get("/", function (res, req) {
  res.send({ 1: "2" });
});

module.exports = router;
