import { type IVoting } from './voting.schema.js';
export declare function create(data: Partial<IVoting>): Promise<IVoting>;
export declare function findById(id: string): Promise<IVoting | null>;
export declare function findByShareId(shareId: string): Promise<IVoting | null>;
/** Accepts either a Mongo `_id` or a `shareId` — same handler is used for both
 *  the share-link route and the owner's dashboard route, and the caller
 *  doesn't always know which one it has. */
export declare function findByIdOrShareId(idOrShare: string): Promise<IVoting | null>;
export declare function listByOwner(ownerId: string): Promise<IVoting[]>;
//# sourceMappingURL=voting.repository.d.ts.map