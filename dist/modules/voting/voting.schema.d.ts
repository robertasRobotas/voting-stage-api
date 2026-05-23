import mongoose, { type Document, type Model } from 'mongoose';
import { VotingAccess, VotingStatus } from '../../common/constants/enums.js';
export interface IVotingItem {
    id: string;
    title: string;
    imageUrl?: string;
    order: number;
}
export interface IVoting extends Document {
    _id: mongoose.Types.ObjectId;
    /** Short, URL-friendly id used in shareable links (`/v/<shareId>`). */
    shareId: string;
    title: string;
    description?: string;
    ownerId: mongoose.Types.ObjectId;
    ownerEmail: string;
    status: VotingStatus;
    access: VotingAccess;
    /** Emails invited to vote when access === INVITE_ONLY. Lowercased. */
    invitedEmails: string[];
    items: IVotingItem[];
    finishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const VotingModel: Model<IVoting>;
//# sourceMappingURL=voting.schema.d.ts.map