const encrypt = require('mongoose-encryption');
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

const encKey = process.env.BASE32_KEY;
const sigKey = process.env.BASE64_KEY;

userSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: [
    'email',
    'firstName',
    'lastName',
    'designation',
    'organization',
    'class',
    'program',
    'cohort',
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
