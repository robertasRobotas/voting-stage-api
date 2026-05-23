import { AppError } from '../errors/index.js';
import { sendError } from '../utils/response.util.js';
import { logger } from '../../config/logger.js';
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        if (err.statusCode >= 500) {
            logger.error(err.message, { code: err.code, stack: err.stack });
        }
        else {
            logger.warn(err.message, { code: err.code });
        }
        sendError(res, err.code, err.message, err.statusCode, err.details);
        return;
    }
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    sendError(res, 'INTERNAL_ERROR', 'An unexpected error occurred', 500);
}
export function notFoundHandler(req, res) {
    sendError(res, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`, 404);
}
//# sourceMappingURL=error.middleware.js.map