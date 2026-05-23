import winston from 'winston';
import { env } from './env.js';
const { combine, timestamp, errors, json, colorize, simple } = winston.format;
const isDevelopment = env.NODE_ENV === 'development';
export const logger = winston.createLogger({
    level: env.LOG_LEVEL,
    format: combine(timestamp(), errors({ stack: true }), isDevelopment ? combine(colorize(), simple()) : json()),
    transports: [new winston.transports.Console()],
    silent: env.NODE_ENV === 'test',
});
//# sourceMappingURL=logger.js.map