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

const userSchema = new mongoose.Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    displayName: String,
    photoUrl: String,
  },
  { timestamps: true },
);

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
