const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testCriteriaSchema = new Schema({
    question: { type: String, required: true },
    answer: [{ type: String }],
    test: {
        type: Schema.Types.ObjectId,
        ref: 'Test'
    },
});

const TestCriteria = mongoose.model('TestCriteria', testCriteriaSchema);

module.exports = TestCriteria;
