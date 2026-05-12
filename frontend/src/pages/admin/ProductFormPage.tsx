import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { PageSpinner } from '../../atoms/Spinner';

interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  comparePrice: string;
  stock: string;
  sku: string;
  categoryId: string;
  imageUrls: string;
  isActive: boolean;
  isFeatured: boolean;
}

const empty: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  price: '',
  comparePrice: '',
  stock: '0',
  sku: '',
  categoryId: '',
  imageUrls: '',
  isActive: true,
  isFeatured: false,
};

const AdminProductFormPage: React.FC = () => {
  const { id: slugParam } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!slugParam;

  const [form, setForm] = React.useState<ProductFormState>(empty);
  const [formError, setFormError] = React.useState('');

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ['product', slugParam],
    queryFn: () => productService.getBySlug(slugParam!),
    enabled: isEdit,
    staleTime: 0,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
    staleTime: 1000 * 60 * 30,
  });

  React.useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice ?? '',
        stock: String(product.stock),
        sku: product.sku,
        categoryId: product.categoryId,
        imageUrls: product.imageUrls.join('\n'),
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      });
    }
  }, [product]);

  const set = (key: keyof ProductFormState, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const buildPayload = () => ({
    name: form.name.trim(),
    slug: form.slug.trim() || form.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: form.description.trim(),
    price: form.price,
    comparePrice: form.comparePrice || null,
    stock: parseInt(form.stock, 10) || 0,
    sku: form.sku.trim(),
    categoryId: form.categoryId || undefined,
    imageUrls: form.imageUrls.split('\n').map((u) => u.trim()).filter(Boolean),
    isActive: form.isActive,
    isFeatured: form.isFeatured,
  });

  const createMutation = useMutation({
    mutationFn: () => productService.create(buildPayload()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      navigate('/admin/products');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => productService.update(product!.id, buildPayload()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product', slugParam] });
      navigate('/admin/products');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to update product');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.price || !form.sku.trim()) {
      setFormError('Name, price and SKU are required.');
      return;
    }
    if (isEdit) updateMutation.mutate();
    else createMutation.mutate();
  };

  if (isEdit && loadingProduct) return <PageSpinner />;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl" data-testid="admin-product-form-page">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/products')} className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Products
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8" data-testid="product-form-title">
        {isEdit ? 'Edit Product' : 'New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5" data-testid="product-form">
        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3" data-testid="product-form-error">
            <p className="text-sm text-red-600">{formError}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input label="Product Name *" value={form.name} onChange={(e) => { set('name', e.target.value); if (!isEdit) set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')); }} data-testid="product-form-name" />
          <Input label="Slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} helperText="Auto-generated from name" data-testid="product-form-slug" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="product-form-description"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input label="Price *" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} data-testid="product-form-price" />
          <Input label="Compare Price" type="number" step="0.01" min="0" value={form.comparePrice} onChange={(e) => set('comparePrice', e.target.value)} helperText="Original/strike-through price" data-testid="product-form-compare-price" />
          <Input label="Stock" type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} data-testid="product-form-stock" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="SKU *" value={form.sku} onChange={(e) => set('sku', e.target.value)} data-testid="product-form-sku" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => set('categoryId', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="product-form-category"
            >
              <option value="">No category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs</label>
          <textarea
            value={form.imageUrls}
            onChange={(e) => set('imageUrls', e.target.value)}
            rows={3}
            placeholder="One URL per line"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="product-form-image-urls"
          />
          <p className="text-xs text-gray-400 mt-1">One URL per line</p>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} data-testid="product-form-is-active" />
            Active (visible in shop)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} data-testid="product-form-is-featured" />
            Featured on homepage
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')} data-testid="product-form-cancel">
            Cancel
          </Button>
          <Button type="submit" loading={isPending} data-testid="product-form-submit">
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
