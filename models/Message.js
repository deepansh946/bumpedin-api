const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.ObjectId, ref: 'User' },
    body: { type: String },
  },
  { timestamps: true }
);

const encKey = process.env.BASE32_KEY;
const sigKey = process.env.BASE64_KEY;

messageSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ['body', 'sender', 'receiver'],
});

const Message = mongoose.model('User', messageSchema);

module.exports = Message;
