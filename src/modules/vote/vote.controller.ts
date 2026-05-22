import type { Request, Response, NextFunction } from 'express';
import { sendCreated, sendSuccess } from '../../common/utils/response.util.js';
import * as voteService from './vote.service.js';

function readAnonToken(req: Request): string | undefined {
  const header = req.header('x-anon-token') ?? req.header('X-Anon-Token');
  return header && header.trim().length > 0 ? header.trim() : undefined;
}

export async function cast(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const votingId = req.params.votingId;
    const anonToken = readAnonToken(req);
    const vote = await voteService.castVote(
      votingId,
      {
        userId: req.user?.userId,
        email: req.user?.email,
        displayName: req.user?.displayName,
        anonToken: req.user ? undefined : anonToken,
      },
      req.body,
    );
    sendCreated(res, {
      id: vote._id.toString(),
      allocations: vote.allocations,
    });
  } catch (err) {
    next(err);
  }
}

export async function mine(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const votingId = req.params.votingId;
    const anonToken = readAnonToken(req);
    const voted = await voteService.hasVoted(votingId, {
      userId: req.user?.userId,
      anonToken: req.user ? undefined : anonToken,
    });
    sendSuccess(res, { voted });
  } catch (err) {
    next(err);
  }
}
