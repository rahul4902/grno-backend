const moment = require('moment');
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  age: Number,
  dob: Date,
  email: String,
  name: String,
  gender: String,
  phone: String,
  relation: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
});

memberSchema.set('toJSON', {
  virtuals: true, // Include virtuals in JSON output
  transform: (doc, ret) => {
    if (ret.dob) ret.dob = moment(ret.dob).format('DD/MM/YYYY');
    return ret;
  },
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
