const express = require("express");
const {
  list,
  activeList,
  deleteItem,
  getById,
  sampleTypeUpsert,
} = require("../controllers/sampleTypeController");
const { validate } = require("../helpers/validatorHelper");
const router = express.Router();

router.get("/activeList", activeList);
router
  .get("/list", list)
  .post("/create", sampleTypeUpsert)
  .post("/update", sampleTypeUpsert)
  .delete("/:id", deleteItem)
  .get("/:id", getById);

module.exports = router;
