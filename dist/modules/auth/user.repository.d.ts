import { type IUser } from './user.schema.js';
export interface FirebaseUserInput {
    firebaseUid: string;
    email: string;
    displayName?: string;
    photoUrl?: string;
}
export declare function findOrCreateByFirebase(input: FirebaseUserInput): Promise<IUser>;
export declare function findById(userId: string): Promise<IUser | null>;
export declare function findByEmail(email: string): Promise<IUser | null>;
//# sourceMappingURL=user.repository.d.ts.map