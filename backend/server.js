/**
 * Load dotenv FIRST so process.env is set before any other module.
 * Backend base URL: http://localhost:3002/api
 */
import 'dotenv/config';

import express from 'express';
import connectDB from './src/config/db.js';
import app from './src/app.js';

const PORT = process.env.PORT || 3002;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API base: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
