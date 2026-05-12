import { dataTest } from './data.fixture';
import { expect } from '@playwright/test';

export const test = dataTest;
export { expect };
export type { BaseFixtures } from './base.fixture';
export type { PagesFixtures } from './pages.fixture';
export type { AuthFixtures } from './auth.fixture';
export type { ApiFixtures } from './api.fixture';
export type { DataFixtures } from './data.fixture';
