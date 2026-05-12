import { faker } from '@faker-js/faker';
import { User } from '@domain-types/index';

faker.seed(12345);

export interface UserOverrides {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: 'customer' | 'admin';
}

export type UserBuildResult = Partial<User> & {
  password?: string;
  role?: 'customer' | 'admin';
};

export class UserFactory {
  static build(overrides: UserOverrides = {}): UserBuildResult {
    const firstName = overrides.firstName ?? faker.person.firstName();
    const lastName = overrides.lastName ?? faker.person.lastName();
    return {
      email: overrides.email ?? faker.internet.email({ firstName, lastName }),
      password: overrides.password ?? 'TestPassword123!',
      firstName,
      lastName,
      avatarUrl: null,
      role: overrides.role ?? 'customer',
    };
  }

  static buildMany(count: number, overrides: UserOverrides = {}): UserBuildResult[] {
    return Array.from({ length: count }, () => UserFactory.build(overrides));
  }
}
