import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
/**
 * Sends invitation emails via Resend (https://resend.com) when RESEND_API_KEY
 * is configured. When it isn't, logs the would-be emails so dev still works.
 *
 * Never throws — invitation failures should not block the create/update
 * request that fanned out from. We log and move on.
 */
export async function sendInvites(voting, emails, ctx) {
    if (emails.length === 0)
        return;
    const url = `${env.APP_URL.replace(/\/$/, '')}/v/${voting.shareId}`;
    if (!env.RESEND_API_KEY) {
        logger.info('Email sender not configured — skipping invites (would have sent)', {
            to: emails,
            board: voting.title,
            url,
        });
        return;
    }
    const subject = `You're invited to vote: ${voting.title}`;
    const html = renderInviteHtml({
        title: voting.title,
        description: voting.description,
        url,
        owner: ctx.ownerEmail,
    });
    // Resend's bulk-send endpoint takes up to 100 recipients per call.
    const chunks = chunk(emails, 100);
    for (const batch of chunks) {
        try {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: env.EMAIL_FROM,
                    to: batch,
                    subject,
                    html,
                }),
            });
            if (!res.ok) {
                const body = await res.text().catch(() => '');
                logger.warn('Resend rejected invite batch', { status: res.status, body, batch });
            }
            else {
                logger.info('Invite batch sent', { count: batch.length, board: voting.title });
            }
        }
        catch (err) {
            logger.warn('Invite batch threw', {
                err: err instanceof Error ? err.message : String(err),
                batch,
            });
        }
    }
}
function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size)
        out.push(arr.slice(i, i + size));
    return out;
}
function renderInviteHtml(p) {
    const safeTitle = escapeHtml(p.title);
    const safeDesc = p.description ? `<p style="color:#444">${escapeHtml(p.description)}</p>` : '';
    const safeOwner = escapeHtml(p.owner);
    return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width:520px; margin:0 auto; padding:32px 16px;">
      <h1 style="font-size:22px; margin:0 0 12px;">You're invited to vote 🎤</h1>
      <p style="color:#444"><strong>${safeOwner}</strong> invited you to cast a Eurovision-style ballot on <strong>${safeTitle}</strong>.</p>
      ${safeDesc}
      <p style="margin:24px 0;">
        <a href="${p.url}" style="display:inline-block; background:#e11d48; color:white; padding:12px 18px; border-radius:8px; text-decoration:none; font-weight:600;">Open the board</a>
      </p>
      <p style="font-size:13px; color:#888">If the button doesn't work, paste this into your browser:<br><span style="word-break:break-all">${p.url}</span></p>
    </div>
  `;
}
function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
//# sourceMappingURL=invite-email.service.js.map