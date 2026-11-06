import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
  error?: string | Record<string, any>;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  meta?: ApiResponse['meta']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    data,
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string | Record<string, any>,
  statusCode: number = 400,
  message?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    message: message || (typeof error === 'string' ? error : 'Operation failed'),
    error,
  };
  return res.status(statusCode).json(response);
};
