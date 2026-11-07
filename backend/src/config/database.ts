import mongoose from 'mongoose';
import { env } from './env';

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  // Reuse an existing connection.
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Reuse an ongoing connection attempt.
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
      })
      .then((conn) => {
        console.log(
          `[Database] MongoDB Connected: ${conn.connection.host}`
        );
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;

        console.error(
          '[Database Error] MongoDB connection failed:',
          error
        );

        throw error;
      });
  }

  return connectionPromise;
};

export const disconnectDB = async (): Promise<void> => {
  connectionPromise = null;
  await mongoose.disconnect();
};