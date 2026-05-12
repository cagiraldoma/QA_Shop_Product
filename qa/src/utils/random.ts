import { faker } from '@faker-js/faker';

export function createFaker(seed: string): typeof faker {
  const numericSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  faker.seed(numericSeed);
  return faker;
}

export const seededFaker = createFaker(process.env.DETERMINISTIC_SEED || 'playwright-qa');
