var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const studySchema = new Schema({
  ins_type: String, //C o E (Censo o Encuesta)
  census: {
    type: Schema.Types.ObjectId,
    ref: 'census',
  },
  survey: {
    type: Schema.Types.ObjectId,
    ref: 'survey',
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Study = mongoose.model('Study', studySchema);

module.exports = Study;