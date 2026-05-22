import mongoose from 'mongoose';
import { VoteModel, type IVote } from './vote.schema.js';

export async function findExisting(
  votingId: string,
  identity: { userId?: string; anonToken?: string },
): Promise<IVote | null> {
  const votingObjectId = new mongoose.Types.ObjectId(votingId);
  if (identity.userId) {
    return VoteModel.findOne({
      votingId: votingObjectId,
      userId: new mongoose.Types.ObjectId(identity.userId),
    });
  }
  if (identity.anonToken) {
    return VoteModel.findOne({ votingId: votingObjectId, anonToken: identity.anonToken });
  }
  return null;
}

export async function create(input: Partial<IVote>): Promise<IVote> {
  return VoteModel.create(input);
}

export async function listByVoting(votingId: string): Promise<IVote[]> {
  return VoteModel.find({ votingId: new mongoose.Types.ObjectId(votingId) });
}
