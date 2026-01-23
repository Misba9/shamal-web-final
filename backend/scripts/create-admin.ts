import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './src/config/env.js';

async function createAdminUser() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to database');

    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';

    // Check if user already exists
    const User = (await import('./src/models/User.js')).User;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('❌ User already exists with this email');
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new User({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      isActive: true,
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('   Role: admin');
    console.log('\n⚠️  Please change the password after first login!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
