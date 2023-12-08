const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const { Schema } = mongoose;

const conversationSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const encKey = process.env.BASE32_KEY;
const sigKey = process.env.BASE64_KEY;

conversationSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ['participants'],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
