const express = require('express');
const { list, listByTest } = require('../controllers/qnaController');
const router = express.Router();

router.get('/list', list);
router.get('/listByTest/:testId', listByTest);

module.exports = router;
