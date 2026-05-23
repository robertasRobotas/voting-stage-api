import { nanoid } from 'nanoid';
import mongoose from 'mongoose';
import { ForbiddenError, NotFoundError, ValidationError } from '../../common/errors/index.js';
import { VotingStatus } from '../../common/constants/enums.js';
import * as votingRepo from './voting.repository.js';
import { VotingModel } from './voting.schema.js';
import { VoteModel } from '../vote/vote.schema.js';
export async function createVoting(ownerId, ownerEmail, input) {
    return votingRepo.create({
        title: input.title,
        description: input.description,
        ownerId: new mongoose.Types.ObjectId(ownerId),
        ownerEmail: ownerEmail.toLowerCase(),
        status: VotingStatus.OPEN,
        access: input.access,
        invitedEmails: input.invitedEmails.map((e) => e.toLowerCase()),
        items: input.items.map((it, idx) => ({
            id: nanoid(8),
            title: it.title,
            imageUrl: it.imageUrl,
            order: idx,
        })),
    });
}
export async function listMyVotings(ownerId) {
    return votingRepo.listByOwner(ownerId);
}
export async function getByShareId(shareId) {
    const v = await votingRepo.findByShareId(shareId);
    if (!v)
        throw new NotFoundError('Voting not found', 'VOTING_NOT_FOUND');
    return v;
}
export async function getById(id) {
    const v = await votingRepo.findByIdOrShareId(id);
    if (!v)
        throw new NotFoundError('Voting not found', 'VOTING_NOT_FOUND');
    return v;
}
function assertOwner(v, userId) {
    if (v.ownerId.toString() !== userId) {
        throw new ForbiddenError('Only the creator can perform this action', 'NOT_OWNER');
    }
}
export async function finish(id, userId) {
    const v = await getById(id);
    assertOwner(v, userId);
    v.status = VotingStatus.FINISHED;
    v.finishedAt = new Date();
    await v.save();
    return v;
}
export async function resume(id, userId) {
    const v = await getById(id);
    assertOwner(v, userId);
    v.status = VotingStatus.OPEN;
    v.finishedAt = undefined;
    await v.save();
    return v;
}
/**
 * Returns the prior invitedEmails snapshot too, so the caller (controller →
 * email service) can figure out which addresses are *newly* invited and
 * trigger only those notifications.
 */
export async function updateSettings(id, userId, input) {
    const v = await getById(id);
    assertOwner(v, userId);
    const previousInvitedEmails = [...v.invitedEmails];
    if (input.title !== undefined)
        v.title = input.title;
    if (input.description !== undefined)
        v.description = input.description;
    if (input.access !== undefined)
        v.access = input.access;
    if (input.invitedEmails !== undefined) {
        v.invitedEmails = input.invitedEmails.map((e) => e.toLowerCase());
    }
    await v.save();
    return { voting: v, previousInvitedEmails };
}
export async function addItem(id, userId, input) {
    const v = await getById(id);
    assertOwner(v, userId);
    if (v.status === VotingStatus.FINISHED) {
        throw new ValidationError('Cannot modify items of a finished voting');
    }
    v.items.push({
        id: nanoid(8),
        title: input.title,
        imageUrl: input.imageUrl,
        order: v.items.length,
    });
    await v.save();
    return v;
}
export async function updateItem(id, userId, itemId, input) {
    const v = await getById(id);
    assertOwner(v, userId);
    const item = v.items.find((i) => i.id === itemId);
    if (!item)
        throw new NotFoundError('Item not found', 'ITEM_NOT_FOUND');
    if (input.title !== undefined)
        item.title = input.title;
    // Explicit `null`/empty maps to clearing the image. Service callers pass
    // `undefined` to mean "don't touch", so be careful with this distinction.
    if (input.imageUrl !== undefined) {
        item.imageUrl = input.imageUrl || undefined;
    }
    await v.save();
    return v;
}
export async function removeItem(id, userId, itemId) {
    const v = await getById(id);
    assertOwner(v, userId);
    v.items = v.items.filter((i) => i.id !== itemId);
    v.items.forEach((i, idx) => (i.order = idx));
    await v.save();
    return v;
}
export async function reorderItems(id, userId, itemIds) {
    const v = await getById(id);
    assertOwner(v, userId);
    const known = new Set(v.items.map((i) => i.id));
    if (itemIds.length !== known.size || !itemIds.every((id) => known.has(id))) {
        throw new ValidationError('itemIds must contain every existing item exactly once');
    }
    const byId = new Map(v.items.map((i) => [i.id, i]));
    v.items = itemIds.map((id, idx) => {
        const item = byId.get(id);
        item.order = idx;
        return item;
    });
    await v.save();
    return v;
}
/**
 * Drops the board and every vote that was cast on it. We don't soft-delete:
 * a board with leaked share link can stay reachable forever, so a hard delete
 * is the safer default.
 */
export async function deleteVoting(id, userId) {
    const v = await getById(id);
    assertOwner(v, userId);
    await VoteModel.deleteMany({ votingId: v._id });
    await VotingModel.deleteOne({ _id: v._id });
}
//# sourceMappingURL=voting.service.js.map