import mongoose from 'mongoose';
import { VoteModel } from './vote.schema.js';
export async function findExisting(votingId, identity) {
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
export async function create(input) {
    return VoteModel.create(input);
}
export async function listByVoting(votingId) {
    return VoteModel.find({ votingId: new mongoose.Types.ObjectId(votingId) });
}
//# sourceMappingURL=vote.repository.js.map