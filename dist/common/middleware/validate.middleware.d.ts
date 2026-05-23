import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare function validate<T>(schema: z.ZodSchema<T>, source?: 'body' | 'query' | 'params'): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.middleware.d.ts.map