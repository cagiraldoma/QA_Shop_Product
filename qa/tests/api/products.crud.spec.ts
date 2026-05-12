import { test, expect } from '@fixtures/index';
import { Product } from '@domain-types/index';

test.describe('@api @regression Products CRUD', () => {
  test('can create, read, update and delete a product', async ({ productsEndpoint, productFactory, cleanupTracker }) => {
    const productData = productFactory.build();
    const created = await productsEndpoint.create(productData);
    cleanupTracker.track('products', (created as Product).id);
    expect(created).toHaveProperty('id');

    const fetched = await productsEndpoint.getById((created as Product).id);
    expect(fetched.name).toBe(productData.name);

    const updated = await productsEndpoint.update((created as Product).id, { name: 'Updated Product Name' });
    expect(updated.name).toBe('Updated Product Name');

    await productsEndpoint.delete((created as Product).id);
    await expect(productsEndpoint.getById((created as Product).id)).rejects.toBeDefined();
  });
});
