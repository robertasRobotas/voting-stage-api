import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    displayName: String,
    photoUrl: String,
}, { timestamps: true });
export const UserModel = mongoose.model('User', userSchema);
//# sourceMappingURL=user.schema.js.map