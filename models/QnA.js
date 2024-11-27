const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qnaSchema = new Schema({
    question: { type: String, required: false },
    answer: { type: String, required: false },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'Test'
    },
});

const QnA = mongoose.model('QnA', qnaSchema);

module.exports = QnA;
