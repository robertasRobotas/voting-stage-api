import type { IVoting } from '../voting/voting.schema.js';
/**
 * Sends invitation emails via Resend (https://resend.com) when RESEND_API_KEY
 * is configured. When it isn't, logs the would-be emails so dev still works.
 *
 * Never throws — invitation failures should not block the create/update
 * request that fanned out from. We log and move on.
 */
export declare function sendInvites(voting: IVoting, emails: string[], ctx: {
    ownerEmail: string;
}): Promise<void>;
//# sourceMappingURL=invite-email.service.d.ts.map