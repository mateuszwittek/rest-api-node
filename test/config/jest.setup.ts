import mongoose from 'mongoose';
import { Collection } from 'mongodb';
import path from 'path';
import { loadEnv } from '../../src/config/config';
import config from '../../src/config/config';

loadEnv(path.resolve(config.rootPath, '.env.test'));

const isSystemCollection = (name: string): boolean => name.startsWith('system.');

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URI || '');
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
