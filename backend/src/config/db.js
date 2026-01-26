import mongoose from 'mongoose';

/**
 * MongoDB connection. Only the backend uses DB_URL.
 * Frontend and Admin never connect to the DB.
 */
const connectDB = async () => {
  // Support both DB_URL and MONGO_URI for compatibility
  const dbUrl = process.env.DB_URL || process.env.MONGO_URI;

  if (!dbUrl) {
    throw new Error('DB_URL or MONGO_URI must be set in environment variables');
  }

  const conn = await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  });
  
  console.log(`✅ MongoDB connected: ${conn.connection.host}`);

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });

  return conn;
};

export default connectDB;
