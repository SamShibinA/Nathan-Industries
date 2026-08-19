import mongoose from 'mongoose';
import { env } from '../config/env.js';

/**
 * @desc   Check API Server and Database Connectivity Health
 * @route  GET /api/health
 * @access Public
 */
export const getHealthStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    service: 'NathanIndustries API Server',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: stateMap[dbState] || 'Unknown',
      connected: isHealthy,
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.name || 'N/A',
    },
    version: '1.0.0',
  });
};
