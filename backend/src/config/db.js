import mongoose from 'mongoose';

/**
 * MongoDB connection. Only the backend uses DB_URL.
 * Frontend and Admin never connect to the DB.
 */
const connectDB = async () => {
  const dbUrl = process.env.DB_URL;

  if (!dbUrl) {
    throw new Error('DB_URL is not set in .env');
  }

  const conn = await mongoose.connect(dbUrl);

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
