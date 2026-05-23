export declare function connectDatabase(): Promise<void>;
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
export declare function syncModelIndexes(): Promise<void>;
export declare function disconnectDatabase(): Promise<void>;
//# sourceMappingURL=database.d.ts.map