import mongoose from 'mongoose';
import { Collection } from 'mongodb';
import { config } from '../../src/config/global.config.js';

const isSystemCollection = (name: string): boolean => name.startsWith('system.');

beforeAll(async () => {
  await mongoose.connect(config.database.uri);
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
