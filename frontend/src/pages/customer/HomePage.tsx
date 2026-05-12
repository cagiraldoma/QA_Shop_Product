import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import { categoryService } from '../../services/category.service';
import { ProductCard } from '../../molecules/ProductCard';
import { PageSpinner } from '../../atoms/Spinner';
import { Button } from '../../atoms/Button';

const HomePage: React.FC = () => {
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['products', { featured: true, limit: 6 }],
    queryFn: () => productService.getAll({ featured: true, limit: 6 }),
    staleTime: 1000 * 60 * 5,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
    staleTime: 1000 * 60 * 30,
  });

  const topLevelCategories = categories?.filter((c) => !c.parentId) || [];

  return (
    <div data-testid="home-page">
      {/* Hero */}
      <section
        className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 mb-12 text-white overflow-hidden"
        data-testid="hero-section"
      >
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Products,<br />Tested to Perfection</h1>
          <p className="text-indigo-100 text-lg mb-8 max-w-lg">
            A full-stack e-commerce platform built for QA engineers to practice end-to-end automation.
          </p>
          <div className="flex gap-3">
            <Link to="/shop">
              <Button variant="secondary" size="lg" data-testid="hero-shop-button">
                Shop Now
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/40 border" data-testid="hero-register-button">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {topLevelCategories.length > 0 && (
        <section className="mb-12" data-testid="categories-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {topLevelCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop/category/${cat.slug}`}
                className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
                data-testid="category-tile"
                data-category-slug={cat.slug}
              >
                {cat.imageUrl && (
                  <img src={cat.imageUrl} alt={cat.name} className="h-16 w-16 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform" />
                )}
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section data-testid="featured-products-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/shop" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium" data-testid="view-all-link">
            View all →
          </Link>
        </div>

        {loadingFeatured ? (
          <PageSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="featured-products-grid">
            {featuredData?.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
