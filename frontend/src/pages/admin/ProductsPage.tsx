import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { PageSpinner } from '../../atoms/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', { search, page }],
    queryFn: () => productService.getAll({ search: search || undefined, page, limit: 15 }),
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDeleteId(null);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      productService.update(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  return (
    <div data-testid="admin-products-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new">
          <Button data-testid="create-product-button">+ New Product</Button>
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="max-w-sm"
            data-testid="products-search-input"
          />
        </div>

        {isLoading ? (
          <div className="py-12"><PageSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="products-table">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors" data-testid="product-row" data-product-id={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {product.imageUrls[0] ? (
                            <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" data-testid="product-row-name">{product.name}</p>
                          {product.isFeatured && (
                            <span className="text-xs text-indigo-600">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" data-testid="product-row-sku">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900" data-testid="product-row-price">
                      {formatCurrency(Number(product.price))}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock <= 5 ? 'text-amber-600' : 'text-gray-900'}`}
                        data-testid="product-row-stock"
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActiveMutation.mutate({ id: product.id, isActive: !product.isActive })}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          product.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        data-testid="product-row-toggle-active"
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/products/${product.slug}/edit`)}
                          data-testid="product-row-edit"
                        >
                          Edit
                        </Button>
                        {deleteId === product.id ? (
                          <div className="flex gap-1">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deleteMutation.mutate(product.id)}
                              loading={deleteMutation.isPending}
                              data-testid="product-row-delete-confirm"
                            >
                              Confirm
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)} data-testid="product-row-delete-cancel">
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(product.id)}
                            data-testid="product-row-delete"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.data.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-400" data-testid="products-empty">
                No products found
              </div>
            )}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-gray-100" data-testid="products-pagination">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} data-testid="products-prev">
              Previous
            </Button>
            <span className="text-sm text-gray-600" data-testid="products-pagination-info">
              {data.page} / {data.totalPages}
            </span>
            <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} data-testid="products-next">
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
