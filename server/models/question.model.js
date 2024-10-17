var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const questionSchema = new Schema({
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  //true: visible, false: invisible
  visibility: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;