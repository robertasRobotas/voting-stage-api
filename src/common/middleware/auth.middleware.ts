import type { Request, Response, NextFunction } from 'express';
import { firebaseConfigured, verifyFirebaseIdToken } from '../../config/firebase.js';
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

/**
 * Pull email out of the ID token. Firebase's top-level `email` claim is
 * usually present for Google sign-in, but for some federated providers it
 * lives under `firebase.identities` instead. Fall back to a placeholder so we
 * can still persist the user record.
 */
function extractEmail(claims: Awaited<ReturnType<typeof verifyFirebaseIdToken>>): string {
  if (claims.email) return claims.email;
  const identities = (claims.raw.firebase as { identities?: Record<string, unknown> } | undefined)
    ?.identities;
  if (identities) {
    for (const value of Object.values(identities)) {
      if (Array.isArray(value)) {
        const found = value.find((v) => typeof v === 'string' && v.includes('@'));
        if (typeof found === 'string') return found;
      }
    }
  }
  return `${claims.uid}@noemail.firebase`;
}

async function attachUserFromToken(req: Request, idToken: string): Promise<void> {
  const claims = await verifyFirebaseIdToken(idToken);
  const email = extractEmail(claims);
  const user = await userRepository.findOrCreateByFirebase({
    firebaseUid: claims.uid,
    email,
    displayName: claims.name,
    photoUrl: claims.picture,
  });
  req.user = {
    userId: user._id.toString(),
    email: user.email,
    firebaseUid: user.firebaseUid,
    displayName: user.displayName,
    photoUrl: user.photoUrl,
  };
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  if (!firebaseConfigured) {
    return next(
      new UnauthorizedError(
        'Firebase project id is not configured on the server',
        'AUTH_NOT_CONFIGURED',
      ),
    );
  }
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid authorization header'));
  }
  try {
    await attachUserFromToken(req, authHeader.slice(7));
    next();
  } catch (err) {
    logger.warn('Firebase token verification failed', {
      err: err instanceof Error ? err.message : err,
    });
    next(new UnauthorizedError('Invalid or expired token', 'TOKEN_INVALID'));
  }
}

/**
 * For routes that work for both signed-in and anonymous callers. Populates
 * `req.user` if a valid token is present; otherwise leaves it undefined and
 * lets the handler fall back to the `X-Anon-Token` header.
 */
export async function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || !firebaseConfigured) return next();
  try {
    await attachUserFromToken(req, authHeader.slice(7));
  } catch (err) {
    logger.debug('optionalAuth: token rejected, continuing anonymous', {
      err: err instanceof Error ? err.message : err,
    });
  }
  next();
}
