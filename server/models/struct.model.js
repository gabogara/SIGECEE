var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const structSchema = new Schema({
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  visibility: {
    type: Boolean,
    required: true,
  },
  count_questions: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Struct = mongoose.model('Struct', structSchema);

module.exports = Struct;