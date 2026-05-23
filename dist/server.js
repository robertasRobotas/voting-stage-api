import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase, syncModelIndexes } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
async function bootstrap() {
    await connectDatabase();
    // Build the app first so imports register all Mongoose models, then
    // reconcile indexes - running it before createApp would see an empty
    // model list and skip the work.
    const app = createApp();
    await syncModelIndexes();
    const server = app.listen(env.PORT, () => {
        logger.info(`Server running on port ${env.PORT}`, { env: env.NODE_ENV });
    });
    const shutdown = (signal) => {
        logger.info(`Received ${signal}, shutting down gracefully`);
        server.close(async () => {
            await disconnectDatabase();
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    console.error('Bootstrap failed', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map