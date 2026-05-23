import mongoose from 'mongoose';
import { VotingModel } from './voting.schema.js';
export async function create(data) {
    return VotingModel.create(data);
}
export async function findById(id) {
    if (!mongoose.isValidObjectId(id))
        return null;
    return VotingModel.findById(id);
}
export async function findByShareId(shareId) {
    return VotingModel.findOne({ shareId });
}
/** Accepts either a Mongo `_id` or a `shareId` — same handler is used for both
 *  the share-link route and the owner's dashboard route, and the caller
 *  doesn't always know which one it has. */
export async function findByIdOrShareId(idOrShare) {
    if (mongoose.isValidObjectId(idOrShare)) {
        const byId = await VotingModel.findById(idOrShare);
        if (byId)
            return byId;
    }
    return VotingModel.findOne({ shareId: idOrShare });
}
export async function listByOwner(ownerId) {
    return VotingModel.find({ ownerId }).sort({ createdAt: -1 });
}
//# sourceMappingURL=voting.repository.js.map