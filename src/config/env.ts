import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1),
  // Firebase Admin SDK is optional during early development — server boots
  // without it so the frontend can be exercised. Any endpoint that needs to
  // verify a Firebase ID token will return AUTH_NOT_CONFIGURED until all
  // three values are set. Drop in a service-account JSON to enable.
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  APP_URL: z.string().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

if (parsed.data.NODE_ENV === 'production' && parsed.data.CORS_ORIGIN === '*') {
  console.error(
    'CORS_ORIGIN cannot be "*" in production - set it to your frontend domain',
  );
  process.exit(1);
}

export const env = parsed.data;
