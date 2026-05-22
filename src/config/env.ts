import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1),
  // Optional in dev so the server can boot without auth wired up. Auth-required
  // routes return AUTH_NOT_CONFIGURED until this is set.
  FIREBASE_PROJECT_ID: z.string().optional(),
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
