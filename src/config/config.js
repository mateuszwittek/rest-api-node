import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',
  rootPath: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../'),
};

export default config;
