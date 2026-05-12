import { User } from '@domain-types/index';

export type UserBuildResult = Partial<User> & {
  password?: string;
  role?: 'customer' | 'admin';
};

export class UserBuilder {
  private email: string = 'test@example.com';
  private password: string = 'TestPassword123!';
  private firstName: string = 'Test';
  private lastName: string = 'User';
  private role: 'customer' | 'admin' = 'customer';

  withEmail(email: string): this {
    this.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.password = password;
    return this;
  }

  withFirstName(firstName: string): this {
    this.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.lastName = lastName;
    return this;
  }

  withRole(role: 'customer' | 'admin'): this {
    this.role = role;
    return this;
  }

  build(): UserBuildResult {
    return {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      avatarUrl: null,
      role: this.role,
    };
  }
}
