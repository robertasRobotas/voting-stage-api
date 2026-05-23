import mongoose from 'mongoose';
import { ForbiddenError, NotFoundError, ValidationError, } from '../../common/errors/index.js';
import { EUROVISION_POINTS } from '../../common/constants/index.js';
import { VotingAccess, VotingStatus } from '../../common/constants/enums.js';
import * as votingRepo from '../voting/voting.repository.js';
import * as voteRepo from './vote.repository.js';
function validateAllocations(allocations, knownItemIds) {
    if (allocations.length === 0) {
        throw new ValidationError('At least one allocation is required');
    }
    const seenItems = new Set();
    const seenPoints = new Set();
    for (const a of allocations) {
        if (!knownItemIds.has(a.itemId)) {
            throw new ValidationError(`Unknown item: ${a.itemId}`);
        }
        if (seenItems.has(a.itemId)) {
            throw new ValidationError(`Duplicate allocation for item ${a.itemId}`);
        }
        if (seenPoints.has(a.points)) {
            throw new ValidationError(`Each Eurovision point value may only be used once (duplicate: ${a.points})`);
        }
        seenItems.add(a.itemId);
        seenPoints.add(a.points);
    }
}
/**
 * Upsert a vote — first call creates, later calls replace the allocation in
 * place. This is the "or just opens previous session" half of the spec: a
 * voter who returns to a board they've already voted on can change their
 * ballot any time before the board is finished.
 */
export async function castVote(votingIdOrShare, identity, input) {
    const voting = await votingRepo.findByIdOrShareId(votingIdOrShare);
    if (!voting)
        throw new NotFoundError('Voting not found', 'VOTING_NOT_FOUND');
    if (voting.status !== VotingStatus.OPEN) {
        throw new ForbiddenError('Voting is not open for voting', 'VOTING_CLOSED');
    }
    if (voting.access === VotingAccess.INVITE_ONLY) {
        if (!identity.email) {
            throw new ForbiddenError('Sign in required to vote on this board', 'AUTH_REQUIRED');
        }
        if (!voting.invitedEmails.includes(identity.email.toLowerCase())) {
            throw new ForbiddenError('Your email is not invited to this voting', 'NOT_INVITED');
        }
    }
    if (!identity.userId && !identity.anonToken) {
        throw new ValidationError('Anonymous voters must send an X-Anon-Token header');
    }
    const knownItemIds = new Set(voting.items.map((i) => i.id));
    validateAllocations(input.allocations, knownItemIds);
    const existing = await voteRepo.findExisting(voting._id.toString(), {
        userId: identity.userId,
        anonToken: identity.anonToken,
    });
    if (existing) {
        existing.allocations = input.allocations;
        if (identity.displayName)
            existing.voterName = identity.displayName;
        else if (input.voterName !== undefined)
            existing.voterName = input.voterName;
        if (identity.email)
            existing.voterEmail = identity.email.toLowerCase();
        await existing.save();
        return { vote: existing, updated: true };
    }
    const created = await voteRepo.create({
        votingId: voting._id,
        userId: identity.userId ? new mongoose.Types.ObjectId(identity.userId) : undefined,
        anonToken: identity.anonToken,
        voterEmail: identity.email?.toLowerCase(),
        voterName: identity.displayName ?? input.voterName,
        allocations: input.allocations,
    });
    return { vote: created, updated: false };
}
export async function getMyVote(votingIdOrShare, identity) {
    const voting = await votingRepo.findByIdOrShareId(votingIdOrShare);
    if (!voting)
        return null;
    return voteRepo.findExisting(voting._id.toString(), identity);
}
export async function getResults(votingId) {
    const votes = await voteRepo.listByVoting(votingId);
    const perItem = new Map();
    for (const v of votes) {
        for (const a of v.allocations) {
            const entry = perItem.get(a.itemId) ?? { totalPoints: 0, voteCount: 0, breakdown: {} };
            entry.totalPoints += a.points;
            entry.voteCount += 1;
            entry.breakdown[a.points.toString()] = (entry.breakdown[a.points.toString()] ?? 0) + 1;
            perItem.set(a.itemId, entry);
        }
    }
    return {
        totalVotes: votes.length,
        perItem: Array.from(perItem.entries())
            .map(([itemId, e]) => ({
            itemId,
            totalPoints: e.totalPoints,
            voteCount: e.voteCount,
            pointsBreakdown: e.breakdown,
        }))
            .sort((a, b) => b.totalPoints - a.totalPoints),
    };
}
/**
 * Owner-only voter list: who has voted, when, and what they gave each item.
 * Combined with the board's `invitedEmails` it lets the owner see who's
 * missing from an invite-only board.
 */
export async function listVoters(votingId) {
    const votes = await voteRepo.listByVoting(votingId);
    return votes
        .map((v) => ({
        voteId: v._id.toString(),
        voterName: v.voterName,
        voterEmail: v.voterEmail,
        isSignedIn: !!v.userId,
        isAnonymous: !v.userId,
        allocations: v.allocations.map((a) => ({ itemId: a.itemId, points: a.points })),
        castAt: v.createdAt,
    }))
        .sort((a, b) => a.castAt.getTime() - b.castAt.getTime());
}
export const POINT_LADDER = EUROVISION_POINTS;
//# sourceMappingURL=vote.service.js.map