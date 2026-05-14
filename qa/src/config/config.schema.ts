import { z } from 'zod';

export const configSchema = z.object({
  BASE_URL: z.string().url().default('http://localhost'),
  API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_PASSWORD: z.string().min(1).default('admin123'),
  CUSTOMER_EMAIL: z.string().email().default('customer@example.com'),
  CUSTOMER_PASSWORD: z.string().min(1).default('customer123'),
  ENV: z.enum(['dev', 'staging', 'prod']).default('dev'),
  DETERMINISTIC_SEED: z.string().default('playwright-qa'),
  CI: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export type Config = z.infer<typeof configSchema>;
