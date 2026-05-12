# QA Automation Framework

> Production-grade end-to-end and API test automation powered by **Playwright** + **TypeScript**.

This framework validates the entire `qa-practice-product` e-commerce stack — React frontend, NestJS backend, and PostgreSQL database — across browser, API, and visual regression test suites.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Architecture](#test-architecture)
  - [Page Object Model (POM)](#page-object-model-pom)
  - [Custom Fixtures](#custom-fixtures)
  - [API Testing Layer](#api-testing-layer)
  - [Test Data Management](#test-data-management)
  - [Authentication & State Management](#authentication--state-management)
- [Writing Tests](#writing-tests)
  - [E2E Test Example](#e2e-test-example)
  - [API Test Example](#api-test-example)
  - [Visual Test Example](#visual-test-example)
- [CI/CD](#cicd)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Contributing](#contributing)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Playwright 1.60](https://playwright.dev) | Browser automation, API testing, visual regression |
| [TypeScript](https://www.typescriptlang.org) | Strict type safety across the entire codebase |
| [@faker-js/faker](https://fakerjs.dev) | Deterministic test data generation |
| [Zod](https://zod.dev) | Runtime environment variable validation |
| [Allure](https://allurereport.org) | Rich HTML test reporting with timelines and attachments |
| [ESLint](https://eslint.org) + [Prettier](https://prettier.io) | Code quality and consistent formatting |

---

## Prerequisites

- **Node.js** `>= 20.0.0`
- **npm** `>= 10.0.0`
- The application stack (frontend + backend) must be running locally or accessible at the URLs you configure.

---

## Installation

```bash
# 1. Navigate to the QA workspace
cd qa

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install

# 4. Create your environment file
cp .env.example .env
# → Edit .env and set BASE_URL, API_BASE_URL, and credentials for your environment

# 5. Verify everything works
npm run test:smoke
```

---

## Project Structure

```
qa/
├── src/
│   ├── config/            # Environment schema (Zod) + typed config loader
│   ├── types/             # Shared domain types (Product, User, Order, Category, ...)
│   ├── utils/             # Logger, validators, deterministic faker wrapper
│   ├── api/               # Typed REST API client + endpoint modules
│   │   ├── api-client.ts
│   │   ├── endpoints/
│   │   │   ├── auth.endpoint.ts
│   │   │   ├── users.endpoint.ts
│   │   │   ├── products.endpoint.ts
│   │   │   └── orders.endpoint.ts
│   │   └── types.ts
│   ├── data/              # Test data factories, builders, seed runner, cleanup tracker
│   │   ├── factories/
│   │   ├── builders/
│   │   ├── seed-runner.ts
│   │   └── cleanup.ts
│   ├── fixtures/          # Custom Playwright fixtures (the backbone of the framework)
│   │   ├── base.fixture.ts
│   │   ├── pages.fixture.ts
│   │   ├── auth.fixture.ts
│   │   ├── api.fixture.ts
│   │   ├── data.fixture.ts
│   │   └── index.ts
│   ├── pages/             # Page Object Model — one class per application screen
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   ├── shop.page.ts
│   │   ├── cart.page.ts
│   │   ├── checkout.page.ts
│   │   └── admin/
│   │       └── dashboard.page.ts
│   ├── components/        # Reusable UI component abstractions
│   │   ├── navbar.component.ts
│   │   ├── product-card.component.ts
│   │   └── pagination.component.ts
│   └── setup/             # Global setup (auth seeding) + teardown (cleanup)
│       ├── global-setup.ts
│       └── global-teardown.ts
├── tests/
│   ├── e2e/               # End-to-end user journey tests
│   ├── api/               # Pure API contract tests
│   ├── visual/            # Screenshot regression tests
│   ├── smoke/             # Fast critical-path gate tests
│   └── regression/        # Full coverage suite
├── docs/
│   ├── CONVENTIONS.md     # Naming rules, selector hierarchy, patterns
│   └── TESTING_GUIDE.md   # Copy-pasteable examples per test type
├── playwright.config.ts   # Multi-project Playwright configuration
├── tsconfig.json          # Strict TypeScript with path aliases
├── eslint.config.mjs      # ESLint v9+ flat configuration
├── .prettierrc            # Prettier formatting rules
└── .env.example           # Documented environment variables
```

---

## Configuration

All environment-specific values live in `.env` (gitignored). Copy from `.env.example` and customize:

```bash
# Application URLs
BASE_URL=http://localhost:5173
API_BASE_URL=http://localhost:3000

# Pre-seeded test accounts (used by global-setup.ts to create storage states)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
CUSTOMER_EMAIL=customer@example.com
CUSTOMER_PASSWORD=customer123

# Framework behavior
ENV=dev
DETERMINISTIC_SEED=playwright-qa
```

**Defaults are baked in** — if you forget to create `.env`, the framework falls back to `localhost` defaults so `npm run test:smoke` still works for local development.

---

## Running Tests

| Command | What it runs | Browsers | Approx. time |
|---------|-------------|----------|-------------|
| `npm run test:smoke` | Critical path gate | Chromium | ~30s |
| `npm run test:e2e` | Full E2E suite | Chromium, Firefox, WebKit | ~3-5 min |
| `npm run test:api` | API contract tests | Headless (no browser) | ~15s |
| `npm run test:visual` | Screenshot comparisons | Chromium | ~30s |
| `npm run test:regression` | Everything tagged `@regression` | All | ~5-10 min |

**Run a single test file:**
```bash
npx playwright test tests/e2e/login.spec.ts
```

**Run with UI mode (interactive debugger):**
```bash
npx playwright test --ui
```

**Update visual baselines:**
```bash
npx playwright test --update-snapshots
```

**Run only smoke tests across all browsers:**
```bash
npx playwright test --grep "@smoke"
```

---

## Test Architecture

### Page Object Model (POM)

Every screen in the app has a dedicated page class under `src/pages/`. All page objects extend `BasePage`, which provides common navigation and assertion helpers.

```ts
// src/pages/login.page.ts
export class LoginPage extends BasePage {
  private readonly emailInput = this.page.locator('[data-testid="login-email-input"]');
  private readonly passwordInput = this.page.locator('[data-testid="login-password-input"]');
  private readonly submitButton = this.page.locator('[data-testid="login-submit-button"]');

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectErrorMessage(text: string): Promise<void> {
    await expect(this.page.locator('[data-testid="login-error"]')).toContainText(text);
  }
}
```

**Selector hierarchy** (enforced by convention):
1. `data-testid` — primary, stable, implementation-agnostic
2. `getByRole` / `getByText` — accessibility-based fallback
3. Never use CSS classes or XPath tied to styling

### Custom Fixtures

The framework extends Playwright's `test` object so every test gets typed dependencies injected automatically. You never instantiate `new LoginPage(page)` manually.

```ts
import { test, expect } from '@fixtures/index';

test('user can checkout', async ({ shopPage, cartPage, checkoutPage, authenticatedPage }) => {
  await authenticatedPage.goto('/shop');
  await shopPage.addFirstProductToCart();
  await cartPage.proceedToCheckout();
  await checkoutPage.placeOrder();
  await checkoutPage.expectOrderConfirmation();
});
```

**Fixture layers** (composed via `test.extend()`):

| Fixture | Provided to tests |
|---------|-------------------|
| `pages` | `loginPage`, `shopPage`, `cartPage`, `checkoutPage`, `dashboardPage`, `navbar`, `productCard`, `pagination` |
| `auth` | `authenticatedContext`, `authenticatedPage`, `adminContext`, `adminPage` |
| `api` | `apiClient`, `authEndpoint`, `usersEndpoint`, `productsEndpoint`, `ordersEndpoint` |
| `data` | `userFactory`, `productFactory`, `seedRunner`, `cleanupTracker` |

### API Testing Layer

The `ApiClient` wraps Playwright's `APIRequestContext` for automatic cookie sharing, request tracing, and typed error handling.

```ts
const product = await productsEndpoint.create({
  name: 'Test Product',
  price: '99.99',
  stock: 10,
});
```

Benefits over raw `fetch` or `axios`:
- Reuses cookies and auth headers automatically
- Network requests appear in Playwright traces
- Typed responses via generics (`ApiResponseBody<T>`)
- Automatic error throwing with structured `ApiError`

### Test Data Management

**Factories** — quick random data:
```ts
const user = UserFactory.build();     // { email, password, firstName, lastName, ... }
const product = ProductFactory.build({ price: '49.99' }); // with override
```

**Builders** — complex, conditional construction:
```ts
const admin = new UserBuilder()
  .withEmail('admin@test.com')
  .withRole('admin')
  .build();
```

**SeedRunner** — orchestrates API-based setup and cleanup:
```ts
const runner = new SeedRunner(apiClient);
const products = await runner.seedProducts(5);
// ... tests run ...
await runner.cleanup(); // deletes everything created
```

All faker calls use a **deterministic seed** so data is reproducible across runs.

### Authentication & State Management

**The problem:** Logging in through the UI for every test adds ~2-5 seconds per test.

**The solution:**
1. `global-setup.ts` logs in as Admin and Customer via API **once** before the test suite starts.
2. It saves browser storage states (`cookies`, `localStorage`) to `storageState/admin.json` and `storageState/customer.json`.
3. The `auth` fixture loads these states into new browser contexts for tests.
4. Tests start already authenticated — zero UI login overhead.

```ts
// This test starts on /profile with an active session
test('customer sees order history', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/profile/orders');
  // page is already logged in as customer
});
```

---

## Writing Tests

### E2E Test Example

```ts
import { test, expect } from '@fixtures/index';
import { config } from '@config/config';

test.describe('@e2e @smoke Authentication', () => {
  test('user can log in with valid credentials', async ({ loginPage }) => {
    await loginPage.goto(`${config.BASE_URL}/login`);
    await loginPage.login(config.CUSTOMER_EMAIL, config.CUSTOMER_PASSWORD);
    await loginPage.toHaveUrl(/\/profile/);
  });

  test('user sees error with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto(`${config.BASE_URL}/login`);
    await loginPage.login('bad@example.com', 'wrong');
    await loginPage.expectErrorMessage('Invalid');
  });
});
```

### API Test Example

```ts
import { test, expect } from '@fixtures/index';

test.describe('@api @regression Users CRUD', () => {
  test('full CRUD lifecycle', async ({ usersEndpoint, userFactory, cleanupTracker }) => {
    // Create
    const userData = userFactory.build();
    const created = await usersEndpoint.create(userData);
    cleanupTracker.track('users', created.id);
    expect(created.email).toBe(userData.email);

    // Read
    const fetched = await usersEndpoint.getById(created.id);
    expect(fetched.firstName).toBe(userData.firstName);

    // Update
    const updated = await usersEndpoint.update(created.id, { firstName: 'Updated' });
    expect(updated.firstName).toBe('Updated');

    // Delete
    await usersEndpoint.delete(created.id);
    await expect(usersEndpoint.getById(created.id)).rejects.toBeDefined();
  });
});
```

### Visual Test Example

```ts
import { test, expect } from '@playwright/test';
import { config } from '@config/config';

test.describe('@visual Login Page', () => {
  test('matches baseline', async ({ page }) => {
    await page.goto(`${config.BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.001,
      mask: [page.locator('[data-testid="login-error"]')],
    });
  });
});
```

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every push/PR and nightly at 2 AM UTC.

### Pipeline

```
┌─────────────────┐
│ Lint & TypeCheck│  ← fails fast if code is broken
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Smoke  │ │ API    │  ← parallel gates (~1 min each)
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         ▼
┌─────────────────┐
│ E2E (4 shards)  │  ← 4 parallel jobs × 3 browsers
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Allure Report   │  ← generated even if some shards fail
└─────────────────┘
```

### Key behaviors

- **Fail-fast:** If smoke tests fail, E2E is skipped.
- **Artifacts:** Traces, screenshots, and videos are uploaded on failure.
- **Sharding:** E2E tests are split across 4 CI workers to keep runtime under 10 minutes.
- **Allure:** A unified report is generated and attached as a CI artifact.

---

## Debugging & Troubleshooting

### Tests fail locally but pass in CI (or vice versa)

1. Check your `.env` — are `BASE_URL` and `API_BASE_URL` pointing to running services?
2. Run with UI mode to see what's happening: `npx playwright test --ui`
3. Check the trace: `npx playwright show-trace test-results/<test-name>/trace.zip`

### "Configuration validation failed" on startup

The Zod schema requires `BASE_URL` and `API_BASE_URL`. If you see this error, create your `.env` file from `.env.example`.

### Flaky tests

1. **Use fixtures** — they provide automatic retries and cleanup.
2. **Avoid `waitForTimeout`** — use explicit locators and `waitForLoadState`.
3. **Isolate data** — each test should create its own user/product via factories.
4. **Check traces** — Playwright records a trace on first retry. Open it in the Trace Viewer.

### Update snapshots

Visual tests fail when the UI changes intentionally. Update baselines:
```bash
npx playwright test --update-snapshots
```

---

## Contributing

1. **Follow conventions** — read `docs/CONVENTIONS.md` before writing code.
2. **Use fixtures** — never instantiate page objects manually in tests.
3. **Tag tests** — every test should have at least one tag (`@smoke`, `@regression`, `@api`, etc.).
4. **Run lint** — `npm run lint` must pass before opening a PR.
5. **Clean up data** — use `cleanupTracker` or `seedRunner.cleanup()` to leave the DB clean.

### Adding a new page object

```bash
# 1. Create the page class
src/pages/checkout.page.ts

# 2. Export it from the barrel
# src/pages/index.ts
export { CheckoutPage } from './checkout.page';

# 3. Add to the pages fixture
# src/fixtures/pages.fixture.ts
checkoutPage: async ({ page }, use) => {
  await use(new CheckoutPage(page));
},

# 4. Write a test using it
# tests/e2e/checkout.spec.ts
```

---

## Useful Links

- [Playwright Docs](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Allure Report Docs](https://allurereport.org/docs/)
- [Project Conventions](./docs/CONVENTIONS.md)
- [Testing Guide](./docs/TESTING_GUIDE.md)

---

<p align="center">
  Built with strict typing, deterministic data, and zero-flakiness philosophy.
</p>
