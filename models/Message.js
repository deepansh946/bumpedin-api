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

const Message = mongoose.model('User', messageSchema);

module.exports = Message;
