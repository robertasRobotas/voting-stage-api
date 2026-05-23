import mongoose, { type Document, type Model } from 'mongoose';
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    firebaseUid: string;
    email: string;
    displayName?: string;
    photoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: Model<IUser>;
//# sourceMappingURL=user.schema.d.ts.map