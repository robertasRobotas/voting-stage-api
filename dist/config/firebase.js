import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from './env.js';
import { logger } from './logger.js';
/**
 * Verify Firebase ID tokens without needing a service-account JSON.
 *
 * Firebase signs ID tokens as RS256 JWTs with rotating Google keys. We only
 * need the public JWKs (cached + auto-refreshed by `jose`) plus the project
 * id to validate `aud` / `iss`. This is exactly what `firebase-admin`'s
 * `verifyIdToken` does internally, minus the SDK and credential plumbing.
 */
export const firebaseConfigured = Boolean(env.FIREBASE_PROJECT_ID);
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
export async function verifyFirebaseIdToken(idToken) {
    if (!firebaseConfigured) {
        throw new Error('Firebase project id is not configured');
    }
    const projectId = env.FIREBASE_PROJECT_ID;
    const { payload } = await jwtVerify(idToken, JWKS, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
    });
    const sub = typeof payload.sub === 'string' ? payload.sub : undefined;
    if (!sub)
        throw new Error('Token missing sub claim');
    return {
        uid: sub,
        email: typeof payload.email === 'string' ? payload.email : undefined,
        name: typeof payload.name === 'string' ? payload.name : undefined,
        picture: typeof payload.picture === 'string' ? payload.picture : undefined,
        emailVerified: typeof payload.email_verified === 'boolean' ? payload.email_verified : undefined,
        raw: payload,
    };
}
if (firebaseConfigured) {
    logger.info('Firebase ID token verifier ready', { projectId: env.FIREBASE_PROJECT_ID });
}
else {
    logger.warn('FIREBASE_PROJECT_ID not set — auth-required endpoints will return AUTH_NOT_CONFIGURED.');
}
//# sourceMappingURL=firebase.js.map