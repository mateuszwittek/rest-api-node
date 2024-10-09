import config from './config/config.js';
import connectDB from './config/database.js';
import app from './app.js';

const { port } = config;
const server = (): void => {
  console.log(`Server is listening on port ${port}`);
};

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, server);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

startServer();
