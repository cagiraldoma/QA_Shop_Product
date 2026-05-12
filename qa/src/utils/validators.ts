export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function assertDefined<T>(value: T | undefined | null, message?: string): T {
  if (value === undefined || value === null) {
    throw new Error(message || 'Expected value to be defined');
  }
  return value;
}

export function assertNonNullish<T>(value: T | undefined | null, message?: string): NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(message || 'Expected non-nullish value');
  }
  return value as NonNullable<T>;
}
