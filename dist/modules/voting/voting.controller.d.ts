import type { Request, Response, NextFunction } from 'express';
export declare function create(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function listMine(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function getPublic(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function finish(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function resume(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateSettings(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function addItem(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function updateItem(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function removeItem(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function reorderItems(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function remove(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=voting.controller.d.ts.map