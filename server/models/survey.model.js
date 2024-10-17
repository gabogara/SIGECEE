var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const surveySchema = new Schema({
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  count_questions: {
    type: Number,
    required: true,
  },
  //true: visible, false: invisible
  visibility: {
    type: Boolean,
    required: true,
  },
  // 0: Sin publicar, 1: Publicado, 2: Finalizado
  status: {
    type: Number,
    default: 0,
    required: true,
  },
  // 0: Abierto (para todo el publico, genera un link), 1: Cerrado (para una poblacion en especifico)
  type: {
    type: Number,
  },
  population: {
    type: Schema.Types.ObjectId,
    ref: 'Population',
  },
  link: {
    type: String,
  },
  emailField: {
    type: String,
  },
  initDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  publishBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  maillist: {
    type: Array,
    default: [],
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;