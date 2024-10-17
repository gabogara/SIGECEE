var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const populationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  header: {
    type: Array,
    default: [],
  },
  data: {
    type: Array,
    default: [],
  },
  /*
    origin
    I: Data de la población proveniente de una importación (Excel)
    C: Data de la población proveniente de un censo 
    P: Data de la población proveniente del Portafolio Digital
  */
  origin: {
    type: String,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Population = mongoose.model('Population', populationSchema);

module.exports = Population;