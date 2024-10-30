import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';

const loadEnv = (envPath?: string): dotenv.DotenvConfigOutput =>
  envPath ? dotenv.config({ path: envPath }) : dotenv.config();

const config: IConfig = {
  port: Number(process.env.PORT) || 3001,
  env: process.env.NODE_ENV || 'development',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  rootPath: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../'),
};

export { loadEnv };
export default config;
