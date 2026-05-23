import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { VotingAccess, VotingStatus } from '../../common/constants/enums.js';
const itemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: String,
    order: { type: Number, required: true, default: 0 },
}, { _id: false });
const votingSchema = new mongoose.Schema({
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
}, { timestamps: true });
export const VotingModel = mongoose.model('Voting', votingSchema);
//# sourceMappingURL=voting.schema.js.map