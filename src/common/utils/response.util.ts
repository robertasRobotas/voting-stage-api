import type { Response } from 'express';
import type { ApiSuccessResponse, ApiErrorResponse } from '../types/index.js';

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): void {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message?: string): void {
  sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 500,
  details?: unknown,
): void {
  const response: ApiErrorResponse = {
    success: false,
    error: { code, message, ...(details !== undefined && { details }) },
  };
  res.status(statusCode).json(response);
}
