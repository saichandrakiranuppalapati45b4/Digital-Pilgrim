import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';
import { env } from '../src/config/env';

const createAdmin = async () => {
  try {
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || env.INITIAL_ADMIN_EMAIL;
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || env.INITIAL_ADMIN_PASSWORD;
    const adminName = process.env.INITIAL_ADMIN_NAME || env.INITIAL_ADMIN_NAME;

    if (!adminEmail || !adminPassword) {
      console.error(
        '[Admin Script Error] INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD environment variables are required.'
      );
      process.exit(1);
    }

    await mongoose.connect(env.MONGODB_URI);
    console.log('[Admin Script] Connected to MongoDB.');

    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingUser) {
      console.log(`[Admin Script] Admin user already exists for email: ${adminEmail}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const newAdmin = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: 'admin',
      isActive: true,
    });

    console.log(
      `[Admin Script] Success! Created administrator account: ${newAdmin.email} (${newAdmin.name})`
    );
    process.exit(0);
  } catch (error) {
    console.error('[Admin Script Error]:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
