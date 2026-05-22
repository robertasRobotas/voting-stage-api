import type { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../common/utils/response.util.js';

export function me(req: Request, res: Response, next: NextFunction): void {
  try {
    const u = req.user!;
    sendSuccess(res, {
      id: u.userId,
      email: u.email,
      displayName: u.displayName,
      photoUrl: u.photoUrl,
    });
  } catch (err) {
    next(err);
  }
}
