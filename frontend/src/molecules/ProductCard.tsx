import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types/product.types';
import { StarRating } from '../atoms/StarRating';
import { Button } from '../atoms/Button';
import { formatCurrency } from '../utils/formatCurrency';
import { useCartStore } from '../stores/cartStore';
import { cartService } from '../services/cart.service';
import { useQueryClient } from '@tanstack/react-query';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const openCart = useCartStore((s) => s.openCart);
  const queryClient = useQueryClient();
  const [adding, setAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    setAdding(true);
    try {
      const cart = await cartService.addItem(product.id, 1);
      syncFromServer(cart);
      openCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const imageUrl = product.imageUrls[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  return (
    <Link
      to={`/products/${product.slug}`}
      data-testid="product-card"
      data-product-id={product.id}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid="product-card-image"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full" data-testid="product-card-out-of-stock">
              Out of Stock
            </span>
          </div>
        )}
        {product.comparePrice && !isOutOfStock && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full" data-testid="product-card-sale-badge">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs text-gray-500">{product.category?.name}</p>
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors" data-testid="product-card-name">
          {product.name}
        </h3>

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.avgRating} size={14} />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-bold text-gray-900" data-testid="product-card-price">
            {formatCurrency(Number(product.price))}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(Number(product.comparePrice))}
            </span>
          )}
        </div>

        {isLowStock && (
          <p className="text-xs text-amber-600 font-medium" data-testid="product-card-low-stock">
            Only {product.stock} left!
          </p>
        )}

        <Button
          variant="primary"
          size="sm"
          fullWidth
          disabled={isOutOfStock}
          loading={adding}
          onClick={handleAddToCart}
          data-testid="product-card-add-to-cart"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  );
};
