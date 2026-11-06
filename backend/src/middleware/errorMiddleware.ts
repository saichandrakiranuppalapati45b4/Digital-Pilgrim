import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.error('[Error Middleware]:', err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, formattedErrors, 422, 'Validation failed');
  }

  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 400, 'Mongoose validation error');
  }

  if (err.name === 'CastError') {
    return sendError(res, `Invalid resource identifier: ${err.value}`, 400);
  }

  if (err.code === 11000) {
    const duplicateKey = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, `Duplicate value for ${duplicateKey}`, 409);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token is invalid or expired', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error occurred';
  return sendError(res, message, statusCode);
};
