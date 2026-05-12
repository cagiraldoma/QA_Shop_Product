# QA Conventions

## Naming

- **Page classes**: PascalCase + `Page` suffix (`LoginPage`, `ShopPage`)
- **Component classes**: PascalCase + `Component` suffix (`NavbarComponent`)
- **Fixture files**: camelCase + `.fixture.ts` (`auth.fixture.ts`)
- **Spec files**: kebab-case + `.spec.ts` (`login.spec.ts`)
- **Test titles**: sentence case, descriptive (`user can log in with valid credentials`)

## Selectors

1. Prefer `data-testid` attributes
2. Fallback to `getByRole` for accessibility
3. Avoid CSS selectors tied to styling

## When to use Factory vs Builder

- **Factory**: Quick, random data generation (`UserFactory.build()`)
- **Builder**: Complex, conditional object construction (`new UserBuilder().withRole('admin').build()`)

## Patterns

- One assertion per test when possible
- Use fixtures, never instantiate page objects manually
- Clean up test data via `cleanupTracker` or `seedRunner.cleanup()`
