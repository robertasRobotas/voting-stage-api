import { HTTP_STATUS } from '../constants/index.js';
export class AppError extends Error {
    statusCode;
    code;
    details;
    isOperational;
    constructor(message, statusCode, code, details, isOperational = true) {
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
    constructor(message, details) {
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
    constructor(message, code = 'NOT_FOUND') {
        super(message, HTTP_STATUS.NOT_FOUND, code);
    }
}
export class ConflictError extends AppError {
    constructor(message, code = 'CONFLICT') {
        super(message, HTTP_STATUS.CONFLICT, code);
    }
}
//# sourceMappingURL=index.js.map