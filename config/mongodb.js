const mongoose = require('mongoose');

// MongoDB connection configuration
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/crm_poc', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
