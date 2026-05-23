export type ApiSuccessResponse<T> = {
    success: true;
    data: T;
    message?: string;
};
export type ApiErrorResponse = {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
};
export interface RequestUser {
    userId: string;
    email: string;
    firebaseUid: string;
    displayName?: string;
    photoUrl?: string;
}
//# sourceMappingURL=index.d.ts.map