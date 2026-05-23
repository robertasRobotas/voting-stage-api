import { type JWTPayload } from 'jose';
/**
 * Verify Firebase ID tokens without needing a service-account JSON.
 *
 * Firebase signs ID tokens as RS256 JWTs with rotating Google keys. We only
 * need the public JWKs (cached + auto-refreshed by `jose`) plus the project
 * id to validate `aud` / `iss`. This is exactly what `firebase-admin`'s
 * `verifyIdToken` does internally, minus the SDK and credential plumbing.
 */
export declare const firebaseConfigured: boolean;
export interface FirebaseClaims {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
    emailVerified?: boolean;
    /** Raw payload, in case callers need provider-specific fields (`firebase.identities` etc). */
    raw: JWTPayload;
}
export declare function verifyFirebaseIdToken(idToken: string): Promise<FirebaseClaims>;
//# sourceMappingURL=firebase.d.ts.map