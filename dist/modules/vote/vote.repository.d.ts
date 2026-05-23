import { type IVote } from './vote.schema.js';
export declare function findExisting(votingId: string, identity: {
    userId?: string;
    anonToken?: string;
}): Promise<IVote | null>;
export declare function create(input: Partial<IVote>): Promise<IVote>;
export declare function listByVoting(votingId: string): Promise<IVote[]>;
//# sourceMappingURL=vote.repository.d.ts.map