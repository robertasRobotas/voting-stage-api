import { type IVoting } from './voting.schema.js';
import type { CreateVotingInput, UpdateSettingsInput } from './voting.schemas.js';
export declare function createVoting(ownerId: string, ownerEmail: string, input: CreateVotingInput): Promise<IVoting>;
export declare function listMyVotings(ownerId: string): Promise<IVoting[]>;
export declare function getByShareId(shareId: string): Promise<IVoting>;
export declare function getById(id: string): Promise<IVoting>;
export declare function finish(id: string, userId: string): Promise<IVoting>;
export declare function resume(id: string, userId: string): Promise<IVoting>;
/**
 * Returns the prior invitedEmails snapshot too, so the caller (controller →
 * email service) can figure out which addresses are *newly* invited and
 * trigger only those notifications.
 */
export declare function updateSettings(id: string, userId: string, input: UpdateSettingsInput): Promise<{
    voting: IVoting;
    previousInvitedEmails: string[];
}>;
export declare function addItem(id: string, userId: string, input: {
    title: string;
    imageUrl?: string;
}): Promise<IVoting>;
export declare function updateItem(id: string, userId: string, itemId: string, input: {
    title?: string;
    imageUrl?: string;
}): Promise<IVoting>;
export declare function removeItem(id: string, userId: string, itemId: string): Promise<IVoting>;
export declare function reorderItems(id: string, userId: string, itemIds: string[]): Promise<IVoting>;
/**
 * Drops the board and every vote that was cast on it. We don't soft-delete:
 * a board with leaked share link can stay reachable forever, so a hard delete
 * is the safer default.
 */
export declare function deleteVoting(id: string, userId: string): Promise<void>;
//# sourceMappingURL=voting.service.d.ts.map