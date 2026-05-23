import type { Response } from 'express';
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number): void;
export declare function sendCreated<T>(res: Response, data: T, message?: string): void;
export declare function sendError(res: Response, code: string, message: string, statusCode?: number, details?: unknown): void;
//# sourceMappingURL=response.util.d.ts.map