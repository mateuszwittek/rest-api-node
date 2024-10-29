import config from './config/config.js';
import connectDB from './config/database.js';
import app from './app.js';

const { port } = config;

const server = app.listen(port);

process.on('uncaughtException', (error: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error('Error:', error.name, error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error('Error:', error);
  server.close(() => {
    process.exit(1);
  });
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

startServer();
