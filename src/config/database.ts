import { IDatabaseConfig, IDatabaseFunction, ISignalHandler } from '../types/types';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import messages from '../utils/messages.js';
import { errors } from '../utils/errorHandler.js';

dotenv.config();

const config: IDatabaseConfig = {
  uri: process.env.DATABASE_URI || '',
};

const connectDB: IDatabaseFunction = async () => {
  try {
    if (!process.env.DATABASE_URI) {
      throw errors.INTERNAL_SERVER(messages.error.ENV_DATABASE_URI);
    }

    await mongoose.connect(config.uri);
    console.log(messages.success.DATABASE_CONNECTED);
  } catch (error) {
    console.error(messages.error.DATABASE_CONNECTION_ERROR, error);
    process.exit(1);
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
