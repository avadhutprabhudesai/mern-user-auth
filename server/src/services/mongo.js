const mongoose = require('mongoose');

mongoose.connection.on('error', () => {
  console.log('Error while connecting to MongoDB');
});

const initDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('MongoDB connection successful');
};

module.exports = { initDatabase };
