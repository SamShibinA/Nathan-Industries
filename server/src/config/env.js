import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nathan_industries',
  JWT_SECRET: process.env.JWT_SECRET || 'nathan_industries_default_dev_secret_key',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate critical variables in production
if (env.isProduction && !process.env.JWT_SECRET) {
  console.warn('[SECURITY WARNING] JWT_SECRET is not explicitly set in production!');
}
