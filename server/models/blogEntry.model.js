var mongoose = require('mongoose');
const { Schema } = require("mongoose");

const blogEntrySchema = new Schema({
  ins_type: String, //C o E (Censo o Encuesta)
  census: {
    type: Schema.Types.ObjectId,
    ref: 'census',
  },
  survey: {
    type: Schema.Types.ObjectId,
    ref: 'survey',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  /*0: inactivo, 1: activo*/
  status: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true,
});

const BlogEntry = mongoose.model('BlogEntry', blogEntrySchema);

module.exports = BlogEntry;