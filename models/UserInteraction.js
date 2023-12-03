const mongoose = require('mongoose');

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

const UserInteraction = mongoose.model('UserInteraction', userInteractionSchema);

module.exports = UserInteraction;
