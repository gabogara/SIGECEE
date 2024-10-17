var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const surveyResultSchema = new Schema({
  survey: {
    type: Schema.Types.ObjectId,
    ref: 'Survey',
  },
  result: {
    type: Schema.Types.Mixed,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  }
}, {
  timestamps: true,
});

const SurveyResult = mongoose.model('SurveyResult', surveyResultSchema);

module.exports = SurveyResult;