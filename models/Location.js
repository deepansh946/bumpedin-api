const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const { Schema } = mongoose;

const locationSchema = Schema(
  {
    location: { type: [Number], required: true, index: '2d' }, // [lng, lat]
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const encKey = process.env.BASE32_KEY;
const sigKey = process.env.BASE64_KEY;

locationSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ['user', 'location'],
});

const Location = mongoose.model('Location', locationSchema);

locationSchema.index({ location: '2dsphere' });

module.exports = Location;
