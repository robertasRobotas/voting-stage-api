import type { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated } from '../../common/utils/response.util.js';
import * as votingService from './voting.service.js';
import * as voteService from '../vote/vote.service.js';
import { VotingAccess } from '../../common/constants/enums.js';
import type { IVoting } from './voting.schema.js';

function isOwner(v: IVoting, userId?: string): boolean {
  return !!userId && v.ownerId.toString() === userId;
}

/** Public view of a voting board. Hides invited-email list from non-owners. */
function toPublicDto(v: IVoting, viewerUserId?: string) {
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

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const v = await votingService.createVoting(req.user!.userId, req.user!.email, req.body);
    sendCreated(res, toPublicDto(v, req.user!.userId));
  } catch (err) {
    next(err);
  }
}

export async function listMine(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await votingService.listMyVotings(req.user!.userId);
    sendSuccess(res, items.map((v) => toPublicDto(v, req.user!.userId)));
  } catch (err) {
    next(err);
  }
}

/** Public route. Anyone with the shareId can fetch the board metadata
 *  (items + status) so they can vote. Results are returned only when the
 *  voting is FINISHED, or to the owner. */
export async function getPublic(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const v = await votingService.getByShareId(req.params.shareId);
    const dto = toPublicDto(v, req.user?.userId);

    const owner = isOwner(v, req.user?.userId);
    const showResults = owner || v.status === 'FINISHED';
    const results = showResults ? await voteService.getResults(v._id.toString()) : undefined;

    // Tell the caller whether they can vote here (so the UI can hide the
    // ballot form for invite-only boards they're not invited to).
    let canVote = v.status === 'OPEN';
    if (canVote && v.access === VotingAccess.INVITE_ONLY) {
      const email = req.user?.email?.toLowerCase();
      canVote = !!email && v.invitedEmails.includes(email);
    }

    sendSuccess(res, { ...dto, canVote, results });
  } catch (err) {
    next(err);
  }
}

export async function finish(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const v = await votingService.finish(req.params.id, req.user!.userId);
    sendSuccess(res, toPublicDto(v, req.user!.userId));
  } catch (err) {
    next(err);
  }
}

export async function resume(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const v = await votingService.resume(req.params.id, req.user!.userId);
    sendSuccess(res, toPublicDto(v, req.user!.userId));
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const v = await votingService.updateSettings(req.params.id, req.user!.userId, req.body);
    sendSuccess(res, toPublicDto(v, req.user!.userId));
  } catch (err) {
    next(err);
  }
}

export async function addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const v = await votingService.addItem(req.params.id, req.user!.userId, req.body);
    sendCreated(res, toPublicDto(v, req.user!.userId));
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const v = await votingService.updateItem(
      req.params.id,
      req.user!.userId,
      req.params.itemId,
      req.body,
    );
    sendSuccess(res, toPublicDto(v, req.user!.userId));
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const v = await votingService.removeItem(req.params.id, req.user!.userId, req.params.itemId);
    sendSuccess(res, toPublicDto(v, req.user!.userId));
  } catch (err) {
    next(err);
  }
}
