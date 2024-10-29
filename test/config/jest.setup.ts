import mongoose from 'mongoose';
import { Collection } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const dbUri = process.env.TEST_DATABASE_URI || '';
const isSystemCollection = (name: string): boolean => name.startsWith('system.');

// Add any test-specific setup here
beforeAll(async () => {
  await mongoose.connect(dbUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  const collections: Collection[] = (await mongoose.connection.db?.collections()) ?? [];
  for (const collection of collections) {
    if (!isSystemCollection(collection.collectionName)) {
      await collection.deleteMany({});
    }
  }
});
