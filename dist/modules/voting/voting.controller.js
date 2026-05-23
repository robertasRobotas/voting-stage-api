import { sendSuccess, sendCreated } from '../../common/utils/response.util.js';
import { HTTP_STATUS } from '../../common/constants/index.js';
import * as votingService from './voting.service.js';
import * as voteService from '../vote/vote.service.js';
import * as inviteEmail from '../email/invite-email.service.js';
import { VotingAccess } from '../../common/constants/enums.js';
function isOwner(v, userId) {
    return !!userId && v.ownerId.toString() === userId;
}
function toPublicDto(v, viewerUserId) {
    const owner = isOwner(v, viewerUserId);
    return {
        id: v._id.toString(),
        shareId: v.shareId,
        title: v.title,
        description: v.description,
        status: v.status,
        access: v.access,
        isOwner: owner,
        ownerEmail: owner ? v.ownerEmail : undefined,
        invitedEmails: owner ? v.invitedEmails : undefined,
        items: v.items
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((i) => ({ id: i.id, title: i.title, imageUrl: i.imageUrl })),
        finishedAt: v.finishedAt,
        createdAt: v.createdAt,
    };
}
export async function create(req, res, next) {
    try {
        const v = await votingService.createVoting(req.user.userId, req.user.email, req.body);
        if (v.access === VotingAccess.INVITE_ONLY && v.invitedEmails.length > 0) {
            void inviteEmail.sendInvites(v, v.invitedEmails, { ownerEmail: req.user.email });
        }
        sendCreated(res, toPublicDto(v, req.user.userId));
    }
    catch (err) {
        next(err);
    }
}
export async function listMine(req, res, next) {
    try {
        const items = await votingService.listMyVotings(req.user.userId);
        sendSuccess(res, items.map((v) => toPublicDto(v, req.user.userId)));
    }
    catch (err) {
        next(err);
    }
}
export async function getPublic(req, res, next) {
    try {
        const v = await votingService.getByShareId(req.params.shareId);
        const dto = toPublicDto(v, req.user?.userId);
        const owner = isOwner(v, req.user?.userId);
        const showResults = owner || v.status === 'FINISHED';
        const results = showResults ? await voteService.getResults(v._id.toString()) : undefined;
        // Owner always sees voter list; voters only see one once it's finished.
        const voters = showResults ? await voteService.listVoters(v._id.toString()) : undefined;
        let canVote = v.status === 'OPEN';
        if (canVote && v.access === VotingAccess.INVITE_ONLY) {
            const email = req.user?.email?.toLowerCase();
            canVote = !!email && v.invitedEmails.includes(email);
        }
        sendSuccess(res, { ...dto, canVote, results, voters });
    }
    catch (err) {
        next(err);
    }
}
export async function finish(req, res, next) {
    try {
        const v = await votingService.finish(req.params.id, req.user.userId);
        sendSuccess(res, toPublicDto(v, req.user.userId));
    }
    catch (err) {
        next(err);
    }
}
export async function resume(req, res, next) {
    try {
        const v = await votingService.resume(req.params.id, req.user.userId);
        sendSuccess(res, toPublicDto(v, req.user.userId));
    }
    catch (err) {
        next(err);
    }
}
export async function updateSettings(req, res, next) {
    try {
        const { voting, previousInvitedEmails } = await votingService.updateSettings(req.params.id, req.user.userId, req.body);
        if (voting.access === VotingAccess.INVITE_ONLY) {
            const previous = new Set(previousInvitedEmails);
            const newlyInvited = voting.invitedEmails.filter((e) => !previous.has(e));
            if (newlyInvited.length > 0) {
                void inviteEmail.sendInvites(voting, newlyInvited, { ownerEmail: req.user.email });
            }
        }
        sendSuccess(res, toPublicDto(voting, req.user.userId));
    }
    catch (err) {
        next(err);
    }
}
export async function addItem(req, res, next) {
    try {
        const v = await votingService.addItem(req.params.id, req.user.userId, req.body);
        sendCreated(res, toPublicDto(v, req.user.userId));
    }
    catch (err) {
        next(err);
    }
}
export async function updateItem(req, res, next) {
    try {
        const v = await votingService.updateItem(req.params.id, req.user.userId, req.params.itemId, req.body);
        sendSuccess(res, toPublicDto(v, req.user.userId));
    }
    catch (err) {
        next(err);
    }
}
export async function removeItem(req, res, next) {
    try {
        const v = await votingService.removeItem(req.params.id, req.user.userId, req.params.itemId);
        sendSuccess(res, toPublicDto(v, req.user.userId));
    }
    catch (err) {
        next(err);
    }
}
export async function reorderItems(req, res, next) {
    try {
        const v = await votingService.reorderItems(req.params.id, req.user.userId, req.body.itemIds);
        sendSuccess(res, toPublicDto(v, req.user.userId));
    }
    catch (err) {
        next(err);
    }
}
export async function remove(req, res, next) {
    try {
        await votingService.deleteVoting(req.params.id, req.user.userId);
        res.status(HTTP_STATUS.NO_CONTENT).send();
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=voting.controller.js.map