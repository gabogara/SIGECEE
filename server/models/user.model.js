var mongoose = require('mongoose');
const { Schema } = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
      type: Schema.Types.ObjectId, 
      ref: 'Role',
    },
    school: {
      type: Schema.Types.ObjectId, 
      ref: 'School',
    },
    image: {
      type: String,
    },
    /*isAdmin: {
      type: Boolean,
      required: true,
    },*/
    /* 0: inactivo, 1: activo, 2: borrado*/
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

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;