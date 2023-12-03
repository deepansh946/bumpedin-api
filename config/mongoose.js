const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  var dotenv = require('dotenv');
  dotenv.config();
}

const { DATABASE_URI } = process.env;

const connectDb = () => mongoose.connect(DATABASE_URI);

module.exports = { connectDb };
