var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const schoolSchema = new Schema({
    alias: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;