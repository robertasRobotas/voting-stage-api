import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../errors/index.js';

export function validate<T>(schema: z.ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.flatten();
      return next(new ValidationError('Validation failed', details));
    }
    req[source] = result.data as (typeof req)[typeof source];
    next();
  };
}
