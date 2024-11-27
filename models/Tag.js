const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    id: { type: Number, required: true },
    tags: { type: String, required: true }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
