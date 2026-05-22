import mongoose, { type Document, type Model } from 'mongoose';

export interface IVoteAllocation {
  itemId: string;
  points: number;
}

export interface IVote extends Document {
  _id: mongoose.Types.ObjectId;
  votingId: mongoose.Types.ObjectId;
  /** Set when the voter is signed in. */
  userId?: mongoose.Types.ObjectId;
  /** Set when the voter is anonymous (link-access). UUID issued by the client
   *  and persisted in localStorage so the same browser can't vote twice. */
  anonToken?: string;
  voterEmail?: string;
  voterName?: string;
  allocations: IVoteAllocation[];
  createdAt: Date;
  updatedAt: Date;
}

const allocSchema = new mongoose.Schema<IVoteAllocation>(
  {
    itemId: { type: String, required: true },
    points: { type: Number, required: true },
  },
  { _id: false },
);

const voteSchema = new mongoose.Schema<IVote>(
  {
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
  },
  { timestamps: true },
);

// One ballot per (voting, signed-in user) and one per (voting, anon token).
// Partial indexes so the unique constraint only applies when the field exists,
// otherwise MongoDB would treat all missing-field docs as duplicates of each
// other and block a second anonymous voter (or second signed-in one).
voteSchema.index(
  { votingId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $exists: true } } },
);
voteSchema.index(
  { votingId: 1, anonToken: 1 },
  { unique: true, partialFilterExpression: { anonToken: { $exists: true } } },
);

export const VoteModel: Model<IVote> = mongoose.model<IVote>('Vote', voteSchema);
