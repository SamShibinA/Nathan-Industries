import mongoose from 'mongoose';
import { env } from './env.js';

let cachedConn = null;

export const connectDB = async () => {
  // Reuse existing connection if ready
  if (cachedConn && mongoose.connection.readyState === 1) {
    return cachedConn;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
    });

    cachedConn = conn;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Error] ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected from database');
      cachedConn = null;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Reconnected to database');
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Failed] ${error.message}`);
    cachedConn = null;
    // In standalone production, exit process. On serverless (Vercel), throw to let handler return 500
    if (env.isProduction && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};
