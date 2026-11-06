import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env';

// Configure DNS resolution for MongoDB Atlas SRV lookup across various DNS/WSL configurations
if (env.MONGODB_URI.includes('mongodb+srv://')) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Ignore if system restricts setting DNS servers
  }
}

export const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB:`, error);
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
