import mongoose from 'mongoose';
import config from './config.js';
import messages from '../utils/messages.js';
import { DatabaseError } from '../errors/customErrors.js';

const { database } = config;

const connectDB: IDatabaseFunction = async (dbConfig: IDatabaseConfig = database) => {
  try {
    if (!dbConfig) {
      throw DatabaseError(messages.error.ENV_DATABASE_URI);
    }
    await mongoose.connect(dbConfig.uri);
  } catch (error) {
    if (error instanceof Error && error.name === 'DatabaseError') {
      throw error;
    }
    throw DatabaseError(messages.error.DATABASE_CONNECTION_ERROR, error as Error);
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
