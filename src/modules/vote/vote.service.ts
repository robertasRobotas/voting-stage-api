import mongoose from 'mongoose';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../../common/errors/index.js';
import { EUROVISION_POINTS } from '../../common/constants/index.js';
import { VotingAccess, VotingStatus } from '../../common/constants/enums.js';
import * as votingRepo from '../voting/voting.repository.js';
import * as voteRepo from './vote.repository.js';
import type { IVote } from './vote.schema.js';
import type { CastVoteInput } from './vote.schemas.js';

export interface VoterIdentity {
  userId?: string;
  email?: string;
  anonToken?: string;
  displayName?: string;
}

function validateAllocations(
  allocations: CastVoteInput['allocations'],
  knownItemIds: Set<string>,
): void {
  if (allocations.length === 0) {
    throw new ValidationError('At least one allocation is required');
  }
  const seenItems = new Set<string>();
  const seenPoints = new Set<number>();
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

export async function castVote(
  votingIdOrShare: string,
  identity: VoterIdentity,
  input: CastVoteInput,
): Promise<IVote> {
  const voting = await votingRepo.findByIdOrShareId(votingIdOrShare);
  if (!voting) throw new NotFoundError('Voting not found', 'VOTING_NOT_FOUND');
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
  if (existing) throw new ConflictError('You have already voted on this board', 'ALREADY_VOTED');

  return voteRepo.create({
    votingId: voting._id,
    userId: identity.userId ? new mongoose.Types.ObjectId(identity.userId) : undefined,
    anonToken: identity.anonToken,
    voterEmail: identity.email?.toLowerCase(),
    voterName: identity.displayName ?? input.voterName,
    allocations: input.allocations,
  });
}

export async function hasVoted(
  votingIdOrShare: string,
  identity: { userId?: string; anonToken?: string },
): Promise<boolean> {
  const voting = await votingRepo.findByIdOrShareId(votingIdOrShare);
  if (!voting) return false;
  const v = await voteRepo.findExisting(voting._id.toString(), identity);
  return !!v;
}

export interface VotingResults {
  totalVotes: number;
  perItem: Array<{
    itemId: string;
    totalPoints: number;
    /** Number of voters who placed this item somewhere in their top ladder. */
    voteCount: number;
    /** Breakdown of how often each point value was given to this item. */
    pointsBreakdown: Record<string, number>;
  }>;
}

export async function getResults(votingId: string): Promise<VotingResults> {
  const votes = await voteRepo.listByVoting(votingId);
  const perItem = new Map<string, { totalPoints: number; voteCount: number; breakdown: Record<string, number> }>();

  for (const v of votes) {
    for (const a of v.allocations) {
      const entry =
        perItem.get(a.itemId) ?? { totalPoints: 0, voteCount: 0, breakdown: {} };
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

export const POINT_LADDER = EUROVISION_POINTS;
