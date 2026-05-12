import { test as base } from '@playwright/test';

export interface BaseFixtures {
  seed: string;
}

export const baseTest = base.extend<BaseFixtures>({
  seed: ['playwright-qa', { option: true }],
});
