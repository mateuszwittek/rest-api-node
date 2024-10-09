import { IDatabaseConfig, IDatabaseFunction, ISignalHandler } from '../types/types';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import messages from '../utils/messages.js';
import { createError } from '../utils/errorHandler.js';

dotenv.config();

const dbConfig: IDatabaseConfig = {
  uri: process.env.DATABASE_URI || '',
};

const connectDB: IDatabaseFunction = async (config: IDatabaseConfig = dbConfig) => {
  try {
    if (!process.env.DATABASE_URI) {
      throw createError(messages.error.ENV_DATABASE_URI);
    }

    await mongoose.connect(config.uri);
    console.log(messages.success.DATABASE_CONNECTED);
  } catch (error) {
    console.error(messages.error.DATABASE_CONNECTION_ERROR, error);
    throw error;
  }
};
const disconnectDB: IDatabaseFunction = async () => {
  try {
    await mongoose.disconnect();
    console.error(messages.success.DATABASE_DISCONNECTED);
  } catch (error) {
    console.error(messages.error.DATABASE_DISCONNECTION_ERROR, error);
  }
};

const handleSIGINT: ISignalHandler = async () => {
  await disconnectDB();
  process.exit(0);
};

process.on('SIGINT', handleSIGINT);

export default connectDB;
