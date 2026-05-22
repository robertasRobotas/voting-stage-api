import { HTTP_STATUS } from '../constants/index.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    details?: unknown,
    isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code = 'FORBIDDEN') {
    super(message, HTTP_STATUS.FORBIDDEN, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, code = 'NOT_FOUND') {
    super(message, HTTP_STATUS.NOT_FOUND, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = 'CONFLICT') {
    super(message, HTTP_STATUS.CONFLICT, code);
  }
}
