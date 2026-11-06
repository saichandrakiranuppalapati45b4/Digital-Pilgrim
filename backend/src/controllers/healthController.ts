import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/apiResponse';
import { env } from '../config/env';

export const getHealth = async (_req: Request, res: Response): Promise<Response> => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const dbState =
    ['disconnected', 'connected', 'connecting', 'disconnecting'][
      mongoose.connection.readyState
    ] || 'unknown';

  let dbLatencyMs: number | null = null;
  if (isDbConnected && mongoose.connection.db) {
    try {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();
      dbLatencyMs = Date.now() - start;
    } catch {
      dbLatencyMs = null;
    }
  }

  const memory = process.memoryUsage();
  const isCloudinaryConfigured =
    Boolean(env.CLOUDINARY_API_KEY) &&
    Boolean(env.CLOUDINARY_API_SECRET) &&
    env.CLOUDINARY_API_SECRET !== 'your_cloudinary_api_secret_here';

  return sendSuccess(
    res,
    {
      status: 'UP',
      service: 'Digital Pilgrim API',
      version: '1.0.0',
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: dbState,
        connected: isDbConnected,
        latencyMs: dbLatencyMs,
        isAtlas: env.MONGODB_URI.includes('mongodb+srv://') || env.MONGODB_URI.includes('.mongodb.net'),
      },
      mediaCloud: {
        provider: 'Cloudinary',
        configured: isCloudinaryConfigured,
        cloudName: env.CLOUDINARY_CLOUD_NAME || 'not_configured',
      },
      system: {
        memoryMb: {
          rss: Math.round(memory.rss / 1024 / 1024),
          heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
        },
      },
    },
    'Digital Pilgrim backend service is operational'
  );
};
