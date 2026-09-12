import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { AppError } from './utils/AppError.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import { seedAdminUser } from './controllers/authController.js';
import { seedInitialProducts } from './controllers/productController.js';
import { seedInitialProjects } from './controllers/projectController.js';
import { seedInitialGallery } from './controllers/galleryController.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express App
const app = express();

// 1. Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS Configuration
const configuredOrigins = env.CLIENT_URL
  ? env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
  : [];

const localDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:3000',
];

const allowedOrigins = [...configuredOrigins, ...localDevOrigins];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured origins and local development
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Automatically allow all *.vercel.app deployment preview/production domains
      if (/^https:\/\/[a-zA-Z0-9-_.]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // Allow all in development mode
      if (env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Request Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
app.use(requestLogger);

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Static Uploads Serving (Legacy fallback if local folder exists)
const uploadRoot = path.resolve(__dirname, '../../', env.UPLOAD_PATH);
if (fs.existsSync(uploadRoot)) {
  app.use(`/${env.UPLOAD_PATH}`, express.static(uploadRoot, {
    maxAge: '1d',
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
    }
  }));
}

// 6. Database Connection Middleware (ensures connection in serverless environment)
let isSeeded = false;

app.use(async (req, res, next) => {
  try {
    await connectDB();
    // In Vercel serverless, run lazy initial seed once on cold start
    if (process.env.VERCEL && !isSeeded) {
      isSeeded = true;
      Promise.all([
        seedAdminUser(),
        seedInitialProducts(),
        seedInitialProjects(),
        seedInitialGallery(),
      ]).catch((err) => console.warn('[Lazy Seed Warning]', err.message));
    }
    next();
  } catch (err) {
    console.error('[DB Request Error]', err);
    next(new AppError('Database connection unavailable. Please verify MongoDB Atlas connection.', 503));
  }
});

// 7. Base Routes & API Mounting
app.get('/', (req, res) => {
  res.json({
    service: 'NathanIndustries Industrial Machinery & Infrastructure Platform',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      projects: '/api/projects',
      gallery: '/api/gallery',
      inquiries: '/api/inquiries',
      quotes: '/api/quotes',
      users: '/api/users',
    },
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/users', userRoutes);

// 8. Unhandled Route Catcher
app.all('*', (req, res, next) => {
  next(new AppError(`Endpoint ${req.method} ${req.originalUrl} not found on this server`, 404));
});

// 9. Global Centralized Error Handler
app.use(errorHandler);

// Standalone Server Bootstrap (running locally with node/nodemon, NOT Vercel serverless)
const startServer = async () => {
  await connectDB();

  // Auto-seed initial catalog, projects portfolio, and gallery
  await seedAdminUser();
  await seedInitialProducts();
  await seedInitialProjects();
  await seedInitialGallery();

  const server = app.listen(env.PORT, () => {
    console.log('====================================================');
    console.log(`🚀 NathanIndustries Server running in [${env.NODE_ENV}] mode`);
    console.log(`📡 URL: http://localhost:${env.PORT}`);
    console.log(`🩺 Health: http://localhost:${env.PORT}/api/health`);
    console.log(`🔑 Auth API: http://localhost:${env.PORT}/api/auth`);
    console.log(`⚙️  Products API: http://localhost:${env.PORT}/api/products`);
    console.log(`🏗️  Projects API: http://localhost:${env.PORT}/api/projects`);
    console.log(`🖼️  Gallery API: http://localhost:${env.PORT}/api/gallery`);
    console.log('====================================================');
  });

  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection] ${err.name}: ${err.message}`);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error(`[Uncaught Exception] ${err.name}: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

// Only listen on port in standalone environment, not inside Vercel serverless function
if (!process.env.VERCEL) {
  startServer();
}

export default app;
