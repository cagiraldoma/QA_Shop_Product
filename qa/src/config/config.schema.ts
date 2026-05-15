import { z } from 'zod';

export const configSchema = z.object({
  BASE_URL: z.string().url().default('http://localhost'),
  API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  ADMIN_EMAIL: z.string().email().default('admin@qashop.com'),
  ADMIN_PASSWORD: z.string().min(1).default('Admin123!'),
  CUSTOMER_EMAIL: z.string().email().default('customer1@test.com'),
  CUSTOMER_PASSWORD: z.string().min(1).default('Test123!'),
  ENV: z.enum(['dev', 'staging', 'prod']).default('dev'),
  DETERMINISTIC_SEED: z.string().default('playwright-qa'),
  CI: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

export type Config = z.infer<typeof configSchema>;
