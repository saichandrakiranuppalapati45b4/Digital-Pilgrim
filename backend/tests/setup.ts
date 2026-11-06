import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeAll, afterAll, beforeEach } from 'vitest';

let mongoServer: MongoMemoryServer | null = null;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 30000,
      },
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  } catch {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digital_pilgrim_test');
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
