import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUri = process.env.TEST_DATABASE_URI || '';
const isSystemCollection = name => name.startsWith('system.');

// Add any test-specific setup here
beforeAll(async () => {
  await mongoose.connect(dbUri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    !isSystemCollection(collection.collectionName) && (await collection.deleteMany({}));
  }
});
