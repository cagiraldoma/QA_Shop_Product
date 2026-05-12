import { apiTest } from './api.fixture';
import { UserFactory, ProductFactory, SeedRunner, CleanupTracker } from '@data/index';

export interface DataFixtures {
  userFactory: typeof UserFactory;
  productFactory: typeof ProductFactory;
  seedRunner: SeedRunner;
  cleanupTracker: CleanupTracker;
}

export const dataTest = apiTest.extend<DataFixtures>({
  userFactory: async ({}, use) => {
    await use(UserFactory);
  },
  productFactory: async ({}, use) => {
    await use(ProductFactory);
  },
  seedRunner: async ({ apiClient }, use) => {
    const runner = new SeedRunner(apiClient);
    await use(runner);
    await runner.cleanup();
  },
  cleanupTracker: async ({}, use) => {
    const tracker = new CleanupTracker();
    await use(tracker);
    tracker.clear();
  },
});
