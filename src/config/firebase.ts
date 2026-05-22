import admin from 'firebase-admin';
import { env } from './env.js';
import { logger } from './logger.js';

function parsePrivateKey(key: string): string {
  let parsed = key;
  if (parsed.startsWith('"') && parsed.endsWith('"')) {
    parsed = parsed.slice(1, -1);
  }
  parsed = parsed.replace(/\\n/g, '\n');
  return parsed;
}

export const firebaseConfigured = Boolean(
  env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY,
);

if (firebaseConfigured && !admin.apps.length) {
  try {
    const privateKey = parsePrivateKey(env.FIREBASE_PRIVATE_KEY!);
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID!,
        clientEmail: env.FIREBASE_CLIENT_EMAIL!,
        privateKey,
      }),
    });
    logger.info('Firebase Admin initialized', { projectId: env.FIREBASE_PROJECT_ID });
  } catch (err) {
    logger.error('Firebase Admin init failed', { error: err instanceof Error ? err.message : err });
    throw err;
  }
} else if (!firebaseConfigured) {
  logger.warn(
    'Firebase Admin NOT configured — auth-required endpoints will return AUTH_NOT_CONFIGURED. Set FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY to enable.',
  );
}

// admin.auth() throws if Firebase isn't initialized — callers must check
// firebaseConfigured first. The auth middleware does this.
export function getFirebaseAuth(): admin.auth.Auth {
  return admin.auth();
}
