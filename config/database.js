import dotenv from 'dotenv';
import mongoose from 'mongoose';
import messages from '../src/utils/messages.js';
import { errors } from '../src/utils/errorHandler.js';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URI) {
      throw errors.INTERNAL_SERVER(messages.error.ENV_DATABASE_URI);
    }

    await mongoose.connect(process.env.DATABASE_URI);
    console.log(messages.success.DATABASE_CONNECTED);
  } catch (error) {
    console.error(messages.error.DATABASE_CONNECTION_ERROR, error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.error(messages.success.DATABASE_DISCONNECTED);
  } catch (error) {
    console.error(messages.error.DATABASE_DISCONNECTION_ERROR, error.message);
  }
};

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

export default connectDB;
