import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { errorHandler, notFoundHandler } from './common/middleware/error.middleware.js';
import { API_PREFIX } from './common/constants/index.js';

import authRouter from './modules/auth/auth.route.js';
import votingRouter from './modules/voting/voting.route.js';
import voteRouter from './modules/vote/vote.route.js';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: false }));

  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Anon-Token'],
      credentials: true,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 1000,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: {
        success: false,
        error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' },
      },
    }),
  );

  if (env.NODE_ENV !== 'test') {
    app.use(
      morgan('combined', {
        stream: { write: (m: string) => logger.info(m.trim()) },
      }),
    );
  }

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
  });

  app.use(`${API_PREFIX}/auth`, authRouter);
  app.use(`${API_PREFIX}/votings`, votingRouter);
  // Mounted with mergeParams so the nested router can read :votingId.
  app.use(`${API_PREFIX}/votings/:votingId/votes`, voteRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
