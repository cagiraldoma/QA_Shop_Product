import { test, expect } from '@fixtures/index';

test.describe('@api @regression Products CRUD', () => {
  test('can create, read, update and delete a product', async ({ productsEndpoint, productFactory, categoriesEndpoint, cleanupTracker }) => {
    // 1. Arrange: obtener una categoría real del seed
    const categories = await categoriesEndpoint.list();
    expect(categories.length).toBeGreaterThan(0);
    const category = categories[0];

    // 2. Arrange: generar datos del producto con categoryId válido
    const productData = productFactory.build({ categoryId: category.id });

    // 3. Act + Assert: Create
    const created = await productsEndpoint.create(productData);
    cleanupTracker.track('products', created.id);
    expect(created).toHaveProperty('id');

    // 4. Act + Assert: Read (backend expone GET /products/:slug)
    const fetched = await productsEndpoint.getBySlug(created.slug);
    expect(fetched.name).toBe(productData.name);

    // 5. Act + Assert: Update
    const updated = await productsEndpoint.update(created.id, { name: 'Updated Product Name' });
    expect(updated.name).toBe('Updated Product Name');

    // 6. Act + Assert: Delete
    await productsEndpoint.delete(created.id);
    await expect(productsEndpoint.getBySlug(created.slug)).rejects.toBeDefined();
  });
});
