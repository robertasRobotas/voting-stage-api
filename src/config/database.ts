import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    process.exit(1);
  }
}

/**
 * Reconcile DB indexes with the current schema definitions. Drops any index
 * that's no longer declared in code and creates new ones - needed when an
 * index changes (e.g. Integration switched from `{projectId, type}` unique
 * to `{projectId, type, notionWorkspaceId}` unique to allow multiple Notion
 * workspaces per project).
 *
 * MUST be called AFTER `createApp()` so all routes/schemas have been
 * imported and the corresponding `mongoose.model()` registrations have
 * fired. Calling it earlier sees an empty model list and does nothing.
 */
export async function syncModelIndexes(): Promise<void> {
  const models = mongoose.modelNames();
  logger.info('Running syncModelIndexes', { modelCount: models.length, models });

  // Belt-and-braces: explicitly drop the old Integration unique index
  // (`projectId_1_type_1`) if it's still present. That's the one that
  // blocks multiple Notion workspaces per project.
  try {
    const Integration = mongoose.models.Integration;
    if (Integration) {
      const existing = await Integration.collection.indexes();
      const stale = existing.find((i) => i.name === 'projectId_1_type_1');
      if (stale) {
        await Integration.collection.dropIndex('projectId_1_type_1');
        logger.info('Dropped stale Integration unique index', {
          name: 'projectId_1_type_1',
        });
      }
    }
  } catch (err) {
    logger.warn('Stale Integration index drop failed', {
      err: err instanceof Error ? err.message : String(err),
    });
  }

  for (const name of models) {
    try {
      const dropped = await mongoose.model(name).syncIndexes();
      logger.info('Indexes synced', { model: name, dropped });
    } catch (err) {
      logger.warn('Index sync failed', {
        model: name,
        err: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
