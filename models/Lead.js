const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  leadsource: {
    type: String,
    trim: true
  },
  leadcomments: {
    type: String,
    trim: true
  },
  leadprocessed: {
    type: String,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },

}, {
  timestamps: true // This adds createdAt and updatedAt fields
});
const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;