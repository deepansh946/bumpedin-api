const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = Schema(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    class: { type: String, required: true },
    program: { type: String, required: true },
    school: { type: String, required: true },
    cohort: { type: String, required: true },
    designation: { type: String },
    organization: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
