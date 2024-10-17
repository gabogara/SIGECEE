var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const roleSchema = new Schema({
  alias: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  order: {
    type: Number,
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;