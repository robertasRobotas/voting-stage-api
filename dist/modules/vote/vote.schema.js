import mongoose from 'mongoose';
const allocSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    points: { type: Number, required: true },
}, { _id: false });
const voteSchema = new mongoose.Schema({
    votingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voting',
        required: true,
        index: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    anonToken: String,
    voterEmail: { type: String, lowercase: true },
    voterName: String,
    allocations: { type: [allocSchema], default: [] },
}, { timestamps: true });
// One ballot per (voting, signed-in user) and one per (voting, anon token).
// Partial indexes so the unique constraint only applies when the field exists,
// otherwise MongoDB would treat all missing-field docs as duplicates of each
// other and block a second anonymous voter (or second signed-in one).
voteSchema.index({ votingId: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $exists: true } } });
voteSchema.index({ votingId: 1, anonToken: 1 }, { unique: true, partialFilterExpression: { anonToken: { $exists: true } } });
export const VoteModel = mongoose.model('Vote', voteSchema);
//# sourceMappingURL=vote.schema.js.map