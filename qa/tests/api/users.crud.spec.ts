import { test, expect } from '@fixtures/index';
import { User } from '@domain-types/index';

test.describe('@api @regression Users CRUD', () => {
  test('can create, read, update and delete a user', async ({ usersEndpoint, userFactory, cleanupTracker }) => {
    const userData = userFactory.build();
    const created = await usersEndpoint.create(userData);
    cleanupTracker.track('users', (created as User).id);
    expect(created).toHaveProperty('id');

    const fetched = await usersEndpoint.getById((created as User).id);
    expect(fetched.email).toBe(userData.email);

    const updated = await usersEndpoint.update((created as User).id, { firstName: 'Updated' });
    expect(updated.firstName).toBe('Updated');

    await usersEndpoint.delete((created as User).id);
    await expect(usersEndpoint.getById((created as User).id)).rejects.toBeDefined();
  });
});
