import dotenv from 'dotenv';
import { configSchema } from './config.schema';

dotenv.config();

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('Configuration warning:', parsed.error.format());
}

export const config = Object.freeze(parsed.success ? parsed.data : configSchema.parse({}));

export function validateConfig(): void {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid configuration:', result.error.format());
    throw new Error('Configuration validation failed');
  }
}
