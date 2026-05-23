import type { Request, Response, NextFunction } from 'express';
import type { RequestUser } from '../types/index.js';
declare global {
    namespace Express {
        interface Request {
            user?: RequestUser;
        }
    }
}
export declare function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void>;
/**
 * For routes that work for both signed-in and anonymous callers. Populates
 * `req.user` if a valid token is present; otherwise leaves it undefined and
 * lets the handler fall back to the `X-Anon-Token` header.
 */
export declare function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map