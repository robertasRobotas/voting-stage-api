import mongoose, { type Document, type Model } from 'mongoose';
import { nanoid } from 'nanoid';
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

const itemSchema = new mongoose.Schema<IVotingItem>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: String,
    order: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const votingSchema = new mongoose.Schema<IVoting>(
  {
    shareId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: () => nanoid(10),
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ownerEmail: { type: String, required: true, lowercase: true },
    status: {
      type: String,
      enum: Object.values(VotingStatus),
      default: VotingStatus.OPEN,
    },
    access: {
      type: String,
      enum: Object.values(VotingAccess),
      default: VotingAccess.LINK,
    },
    invitedEmails: { type: [String], default: [] },
    items: { type: [itemSchema], default: [] },
    finishedAt: Date,
  },
  { timestamps: true },
);

export const VotingModel: Model<IVoting> = mongoose.model<IVoting>('Voting', votingSchema);
