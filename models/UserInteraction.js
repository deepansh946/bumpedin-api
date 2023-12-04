const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const { Schema } = mongoose;

const userInteractionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  connections: [
    {
      user: { type: mongoose.Schema.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'] },
    },
  ],
});

const encKey = process.env.BASE32_KEY;
const sigKey = process.env.BASE64_KEY;

userInteractionSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ['user', 'connections'],
});

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

module.exports = UserInteraction;
