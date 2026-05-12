import { BrowserContext } from '@playwright/test';
import { pagesTest } from './pages.fixture';


export interface AuthFixtures {
  authenticatedContext: BrowserContext;
  authenticatedPage: import('@playwright/test').Page;
  adminContext: BrowserContext;
  adminPage: import('@playwright/test').Page;
}

export const authTest = pagesTest.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use, testInfo) => {
    const storagePath = `storageState/customer-${testInfo.workerIndex}.json`;
    const context = await browser.newContext({ storageState: storagePath });
    await use(context);
    await context.close();
  },
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  },
  adminContext: async ({ browser }, use, testInfo) => {
    const storagePath = `storageState/admin-${testInfo.workerIndex}.json`;
    const context = await browser.newContext({ storageState: storagePath });
    await use(context);
    await context.close();
  },
  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    await use(page);
    await page.close();
  },
});
