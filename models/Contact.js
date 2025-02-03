const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, nullable: true },
  mobile: { type: String, nullable: true },
  email: { type: String, nullable: true },
  message: { type: String, nullable:true },
},{
    timestamps: true // This option adds createdAt and updatedAt fields
  });

module.exports = mongoose.model('Contact', contactSchema);
