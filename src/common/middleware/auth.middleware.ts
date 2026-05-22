import type { Request, Response, NextFunction } from 'express';
import { firebaseConfigured, getFirebaseAuth } from '../../config/firebase.js';
import { UnauthorizedError } from '../errors/index.js';
import { logger } from '../../config/logger.js';
import * as userRepository from '../../modules/auth/user.repository.js';
import type { RequestUser } from '../types/index.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!firebaseConfigured) {
    return next(
      new UnauthorizedError(
        'Firebase Admin is not configured on the server',
        'AUTH_NOT_CONFIGURED',
      ),
    );
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }

  const firebaseAuth = getFirebaseAuth();
  const idToken = authHeader.slice(7);
  try {
    const decoded = await firebaseAuth.verifyIdToken(idToken);

    let email = decoded.email ?? '';
    const displayName = decoded.name ?? '';
    const photoUrl = decoded.picture;

    if (!email) {
      const fbUser = await firebaseAuth.getUser(decoded.uid);
      email = fbUser.email ?? '';
    }
    if (!email) email = `${decoded.uid}@noemail.firebase`;

    const user = await userRepository.findOrCreateByFirebase({
      firebaseUid: decoded.uid,
      email,
      displayName,
      photoUrl,
    });

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      firebaseUid: user.firebaseUid,
      displayName: user.displayName,
      photoUrl: user.photoUrl,
    };
    next();
  } catch (err) {
    logger.warn('Firebase token verification failed', { err });
    next(new UnauthorizedError('Invalid or expired token', 'TOKEN_INVALID'));
  }
}

/**
 * Variant for routes that work for both signed-in and anonymous callers.
 * If a valid Bearer token is present, `req.user` is populated. Otherwise the
 * request passes through unauthenticated — downstream handlers should look
 * at the `X-Anon-Token` header for the localStorage-issued anonymous id.
 *
 * When Firebase isn't configured we silently skip token verification —
 * anonymous voters can still use the board.
 */
export async function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || !firebaseConfigured) return next();

  const firebaseAuth = getFirebaseAuth();
  const idToken = authHeader.slice(7);
  try {
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    let email = decoded.email ?? '';
    if (!email) {
      const fbUser = await firebaseAuth.getUser(decoded.uid);
      email = fbUser.email ?? `${decoded.uid}@noemail.firebase`;
    }
    const user = await userRepository.findOrCreateByFirebase({
      firebaseUid: decoded.uid,
      email,
      displayName: decoded.name ?? '',
      photoUrl: decoded.picture,
    });
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      firebaseUid: user.firebaseUid,
      displayName: user.displayName,
      photoUrl: user.photoUrl,
    };
  } catch (err) {
    logger.debug('optionalAuth: token rejected, continuing anonymous', { err });
  }
  next();
}
