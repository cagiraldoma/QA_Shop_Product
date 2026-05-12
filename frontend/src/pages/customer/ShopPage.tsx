import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import { ProductCard } from '../../molecules/ProductCard';
import { PageSpinner } from '../../atoms/Spinner';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';

const ShopPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const order = (searchParams.get('order') || 'asc') as 'asc' | 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const filters = {
    search: search || undefined,
    category: categorySlug,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: sortBy || undefined,
    order: sortBy ? order : undefined,
    page,
    limit: 12,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getAll(filters),
    staleTime: 1000 * 60 * 5,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
    staleTime: 1000 * 60 * 30,
  });

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div data-testid="shop-page">
      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0" data-testid="filter-sidebar">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-indigo-600 hover:text-indigo-700" data-testid="clear-filters-button">
                Clear all
              </button>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
              <ul className="space-y-2">
                {categories?.filter(c => !c.parentId).map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => updateParam('category', categorySlug === cat.slug ? '' : cat.slug)}
                      className={`text-sm w-full text-left px-2 py-1 rounded ${categorySlug === cat.slug ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                      data-testid={`category-filter-${cat.slug}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="text-xs"
                  data-testid="min-price-input"
                />
                <span className="text-gray-400">—</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="text-xs"
                  data-testid="max-price-input"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [sb, o] = e.target.value.split('-');
                  const next = new URLSearchParams(searchParams);
                  if (sb) { next.set('sortBy', sb); next.set('order', o); } else { next.delete('sortBy'); next.delete('order'); }
                  setSearchParams(next);
                }}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2"
                data-testid="sort-select"
              >
                <option value="-">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="rating-desc">Top Rated</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="max-w-sm"
              data-testid="search-input"
            />
            {data && (
              <span className="text-sm text-gray-500 shrink-0" data-testid="results-count">
                {data.total} {data.total === 1 ? 'result' : 'results'}
              </span>
            )}
          </div>

          {isLoading ? (
            <PageSpinner />
          ) : data?.data.length === 0 ? (
            <div className="text-center py-16" data-testid="empty-results">
              <p className="text-xl text-gray-400 mb-2">No products found</p>
              <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
              <Button variant="secondary" onClick={clearFilters} data-testid="clear-filters-empty-button">Clear filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="product-grid">
                {data?.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {data && data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8" data-testid="pagination">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => updateParam('page', String(page - 1))}
                    data-testid="pagination-prev"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600" data-testid="pagination-info">
                    Page {data.page} of {data.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= data.totalPages}
                    onClick={() => updateParam('page', String(page + 1))}
                    data-testid="pagination-next"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
