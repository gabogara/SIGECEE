var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const censusResultSchema = new Schema({
  census: {
    type: Schema.Types.ObjectId,
    ref: 'Census',
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

const CensusResult = mongoose.model('CensusResult', censusResultSchema);

module.exports = CensusResult;