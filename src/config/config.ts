import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'url';

const env: string = process.env.NODE_ENV || 'development';
const envFileMap: Record<string, string> = {
  development: '.env.dev',
  test: '.env.test',
  production: '.env',
};
const envFile: string = envFileMap[env] || '.env';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), `../../${envFile}`),
});

const config: IConfig = {
  port: Number(process.env.PORT) || 3001,
  env,
  database: {
    uri: process.env.DATABASE_URI || '',
  },
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
  rootPath: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../'),
} as const;

export default config;
