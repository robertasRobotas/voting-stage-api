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
export declare const VoteModel: Model<IVote>;
//# sourceMappingURL=vote.schema.d.ts.map