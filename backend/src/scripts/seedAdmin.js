import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  if (!process.env.DB_URL) {
    console.error('DB_URL must be set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DB_URL);

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      console.log('Admin already exists:', email);
      return;
    }

    // Password is hashed by Admin model pre-save (bcrypt); plain text is never stored.
    await Admin.create({
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
    });

    console.log('Admin created successfully:', email);
  } catch (err) {
    console.error('Seed failed:', err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
    process.exit(0);
  }
}

seedAdmin();
