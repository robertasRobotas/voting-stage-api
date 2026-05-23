export declare const API_PREFIX = "/api/v1";
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE: 422;
    readonly INTERNAL: 500;
};
/**
 * Eurovision-style point ladder. Each voter spends each of these point
 * values exactly once across distinct items in the voting board.
 */
export declare const EUROVISION_POINTS: readonly [1, 2, 3, 4, 5, 6, 7, 8, 10, 12];
export type EurovisionPoint = (typeof EUROVISION_POINTS)[number];
//# sourceMappingURL=index.d.ts.map