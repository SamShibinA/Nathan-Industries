import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Error] ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected from database');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Reconnected to database');
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Failed] ${error.message}`);
    // In dev mode, don't crash immediately so developer can see issues or start mongo
    if (env.isProduction) {
      process.exit(1);
    }
  }
};
