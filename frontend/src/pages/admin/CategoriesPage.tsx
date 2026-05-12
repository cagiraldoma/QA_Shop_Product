import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/category.service';
import type { Category } from '../../types/product.types';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { PageSpinner } from '../../atoms/Spinner';

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: string;
}

const empty: CategoryForm = { name: '', slug: '', description: '', imageUrl: '', parentId: '' };

const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [editId, setEditId] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState<CategoryForm>(empty);
  const [formError, setFormError] = React.useState('');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
    staleTime: 1000 * 60 * 5,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] });

  const buildPayload = () => ({
    name: form.name.trim(),
    slug: form.slug.trim() || form.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description: form.description.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    parentId: form.parentId || null,
  });

  const createMutation = useMutation({
    mutationFn: () => categoryService.create(buildPayload()),
    onSuccess: () => { invalidate(); cancelForm(); },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Failed to create category');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => categoryService.update(editId!, buildPayload()),
    onSuccess: () => { invalidate(); cancelForm(); },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Failed to update category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? '',
      imageUrl: cat.imageUrl ?? '',
      parentId: cat.parentId ?? '',
    });
    setShowForm(true);
    setFormError('');
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(empty);
    setFormError('');
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    setFormError('');
    if (editId) updateMutation.mutate();
    else createMutation.mutate();
  };

  const set = (key: keyof CategoryForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (isLoading) return <PageSpinner />;

  const topLevel = categories?.filter((c) => !c.parentId) ?? [];
  const parentMap = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]));

  return (
    <div data-testid="admin-categories-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }} data-testid="create-category-button">
            + New Category
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8" data-testid="category-form">
          <h2 className="font-semibold text-gray-900 mb-4">{editId ? 'Edit Category' : 'New Category'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <Input label="Name *" value={form.name} onChange={(e) => { set('name', e.target.value); if (!editId) set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')); }} data-testid="category-form-name" />
            <Input label="Slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} data-testid="category-form-slug" />
            <Input label="Description" value={form.description} onChange={(e) => set('description', e.target.value)} data-testid="category-form-description" />
            <Input label="Image URL" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} data-testid="category-form-image-url" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
              <select
                value={form.parentId}
                onChange={(e) => set('parentId', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-testid="category-form-parent"
              >
                <option value="">None (top-level)</option>
                {topLevel.filter((c) => c.id !== editId).map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          {formError && <p className="text-sm text-red-600 mt-3" data-testid="category-form-error">{formError}</p>}
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={cancelForm} data-testid="category-form-cancel">Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
              data-testid="category-form-submit"
            >
              {editId ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid="categories-table-container">
        <table className="w-full" data-testid="categories-table">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Parent</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories?.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors" data-testid="category-row" data-category-id={cat.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {cat.imageUrl && (
                      <img src={cat.imageUrl} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                    )}
                    <span className="font-medium text-gray-900" data-testid="category-row-name">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500" data-testid="category-row-slug">{cat.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500" data-testid="category-row-parent">
                  {cat.parentId ? parentMap[cat.parentId] ?? '—' : <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Top-level</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} data-testid="category-row-edit">Edit</Button>
                    {deleteId === cat.id ? (
                      <div className="flex gap-1">
                        <Button variant="danger" size="sm" onClick={() => deleteMutation.mutate(cat.id)} loading={deleteMutation.isPending} data-testid="category-row-delete-confirm">Delete</Button>
                        <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)} data-testid="category-row-delete-cancel">Cancel</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(cat.id)} data-testid="category-row-delete">Delete</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories?.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400" data-testid="categories-empty">No categories yet</div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
