import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorMiddleware';
import { apiLimiter } from './middleware/rateLimiter';
import { sendError } from './utils/apiResponse';
import { connectDB } from './config/database';

const app: Application = express();

// Trust Vercel's reverse proxy
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for HttpOnly authentication cookies
app.use(cookieParser(env.COOKIE_SECRET));

// Rate limiting for API protection
app.use(env.API_PREFIX, apiLimiter);

// Ensure MongoDB is connected before database-dependent requests.
app.use(env.API_PREFIX, async (req, res, next) => {
  // Allow health checks to report database status.
  if (req.path === '/health' || req.method === 'OPTIONS') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Main API routes
app.use(env.API_PREFIX, apiRoutes);

// Catch-all for undefined routes
app.use('*', (_req: Request, res: Response) => {
  return sendError(res, 'Endpoint not found', 404);
});

// Centralized error handler
app.use(errorHandler);

export default app;
