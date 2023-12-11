const mongoose = require('mongoose');

const { Schema } = mongoose;

const locationSchema = Schema(
  {
    location: { type: [Number], required: true, index: '2d' }, // [lng, lat]
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Location = mongoose.model('Location', locationSchema);

locationSchema.index({ location: '2dsphere' });

module.exports = Location;
