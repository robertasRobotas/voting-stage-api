import type { IVote } from './vote.schema.js';
import type { CastVoteInput } from './vote.schemas.js';
export interface VoterIdentity {
    userId?: string;
    email?: string;
    anonToken?: string;
    displayName?: string;
}
/**
 * Upsert a vote — first call creates, later calls replace the allocation in
 * place. This is the "or just opens previous session" half of the spec: a
 * voter who returns to a board they've already voted on can change their
 * ballot any time before the board is finished.
 */
export declare function castVote(votingIdOrShare: string, identity: VoterIdentity, input: CastVoteInput): Promise<{
    vote: IVote;
    updated: boolean;
}>;
export declare function getMyVote(votingIdOrShare: string, identity: {
    userId?: string;
    anonToken?: string;
}): Promise<IVote | null>;
export interface VotingResults {
    totalVotes: number;
    perItem: Array<{
        itemId: string;
        totalPoints: number;
        voteCount: number;
        pointsBreakdown: Record<string, number>;
    }>;
}
export declare function getResults(votingId: string): Promise<VotingResults>;
export interface VoterRecord {
    voteId: string;
    voterName?: string;
    voterEmail?: string;
    isSignedIn: boolean;
    isAnonymous: boolean;
    /** Per-item allocation; itemId → points. */
    allocations: Array<{
        itemId: string;
        points: number;
    }>;
    castAt: Date;
}
/**
 * Owner-only voter list: who has voted, when, and what they gave each item.
 * Combined with the board's `invitedEmails` it lets the owner see who's
 * missing from an invite-only board.
 */
export declare function listVoters(votingId: string): Promise<VoterRecord[]>;
export declare const POINT_LADDER: readonly [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
//# sourceMappingURL=vote.service.d.ts.map