import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import { reviewService } from '../../services/review.service';
import { cartService } from '../../services/cart.service';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { StarRating } from '../../atoms/StarRating';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { PageSpinner } from '../../atoms/Spinner';
import { QuantitySelector } from '../../molecules/QuantitySelector';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const openCart = useCartStore((s) => s.openCart);

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewTitle, setReviewTitle] = React.useState('');
  const [reviewBody, setReviewBody] = React.useState('');
  const [reviewError, setReviewError] = React.useState('');
  const [reviewSuccess, setReviewSuccess] = React.useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug!),
    staleTime: 1000 * 60 * 10,
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => reviewService.getByProduct(product!.id),
    enabled: !!product?.id,
    staleTime: 1000 * 60 * 5,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addItem(product!.id, quantity),
    onSuccess: (cart) => {
      syncFromServer(cart);
      openCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: () =>
      reviewService.create({
        productId: product!.id,
        rating: reviewRating,
        title: reviewTitle,
        body: reviewBody,
      }),
    onSuccess: () => {
      setReviewSuccess(true);
      setReviewTitle('');
      setReviewBody('');
      setReviewRating(5);
      setReviewError('');
      queryClient.invalidateQueries({ queryKey: ['reviews', product?.id] });
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setReviewError(msg || 'Failed to submit review');
    },
  });

  if (isLoading) return <PageSpinner />;
  if (!product) return <div className="text-center py-16 text-gray-500" data-testid="product-not-found">Product not found</div>;

  const isOutOfStock = product.stock === 0;
  const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const userHasReviewed = reviews?.some((r) => r.userId === user?.id);

  return (
    <div data-testid="product-detail-page">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6" data-testid="breadcrumb">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gray-700">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/shop/category/${product.category.slug}`} className="hover:text-gray-700">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div data-testid="product-gallery">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
            {product.imageUrls.length > 0 ? (
              <img
                src={product.imageUrls[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl" data-testid="product-image-placeholder">
                📦
              </div>
            )}
          </div>
          {product.imageUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2" data-testid="product-thumbnails">
              {product.imageUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-indigo-500' : 'border-transparent hover:border-gray-300'
                  }`}
                  data-testid={`product-thumbnail-${idx}`}
                >
                  <img src={url} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div data-testid="product-info">
          <h1 className="text-3xl font-bold text-gray-900 mb-3" data-testid="product-name">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={Math.round(product.avgRating)} />
            <span className="text-sm text-gray-500" data-testid="product-rating-summary">
              {product.avgRating.toFixed(1)} ({product.reviewCount}{' '}
              {product.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900" data-testid="product-price">
              {formatCurrency(Number(product.price))}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through" data-testid="product-compare-price">
                {formatCurrency(Number(product.comparePrice))}
              </span>
            )}
            {hasDiscount && (
              <span className="text-sm font-medium text-green-600" data-testid="product-discount-pct">
                {Math.round(
                  ((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100,
                )}% off
              </span>
            )}
          </div>

          <div className="mb-6">
            {isOutOfStock ? (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700"
                data-testid="out-of-stock-badge"
              >
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700"
                data-testid="low-stock-badge"
              >
                Only {product.stock} left
              </span>
            ) : (
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700"
                data-testid="in-stock-badge"
              >
                In Stock ({product.stock} available)
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8" data-testid="product-description">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-8">
            <QuantitySelector
              quantity={quantity}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrease={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              min={1}
              max={product.stock}
              disabled={isOutOfStock}
              data-testid="product-quantity-selector"
            />
            <Button
              fullWidth
              disabled={isOutOfStock}
              loading={addToCartMutation.isPending}
              onClick={() => addToCartMutation.mutate()}
              data-testid="add-to-cart-button"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          <div className="text-xs text-gray-400 space-y-1 border-t border-gray-100 pt-4">
            <div>
              SKU: <span data-testid="product-sku" className="text-gray-600">{product.sku}</span>
            </div>
            {product.category && (
              <div>
                Category:{' '}
                <Link to={`/shop/category/${product.category.slug}`} className="text-indigo-600 hover:underline">
                  {product.category.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16" data-testid="reviews-section">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Customer Reviews
          <span className="text-gray-400 font-normal text-lg ml-2" data-testid="reviews-count">
            ({reviews?.length ?? 0})
          </span>
        </h2>

        {/* Write review */}
        {isAuthenticated && !userHasReviewed && !reviewSuccess && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8" data-testid="review-form">
            <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div data-testid="review-rating-input">
                  <StarRating rating={reviewRating} interactive onChange={setReviewRating} size={28} />
                </div>
              </div>
              <Input
                label="Title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
                data-testid="review-title-input"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  data-testid="review-body-input"
                />
              </div>
              {reviewError && (
                <p className="text-sm text-red-600" data-testid="review-error">{reviewError}</p>
              )}
              <Button
                onClick={() => submitReviewMutation.mutate()}
                loading={submitReviewMutation.isPending}
                disabled={!reviewTitle.trim() || !reviewBody.trim()}
                data-testid="review-submit-button"
              >
                Submit Review
              </Button>
            </div>
          </div>
        )}

        {reviewSuccess && (
          <div
            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8"
            data-testid="review-success-message"
          >
            <p className="text-green-700 text-sm font-medium">
              Your review has been submitted successfully!
            </p>
          </div>
        )}

        {!isAuthenticated && (
          <div
            className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 text-center"
            data-testid="review-login-prompt"
          >
            <p className="text-gray-600 mb-3">Sign in to write a review</p>
            <Link to={`/login?returnUrl=/products/${slug}`}>
              <Button variant="secondary" size="sm" data-testid="review-login-button">
                Sign In
              </Button>
            </Link>
          </div>
        )}

        {isAuthenticated && userHasReviewed && !reviewSuccess && (
          <div
            className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-8"
            data-testid="review-already-submitted"
          >
            <p className="text-blue-700 text-sm">You have already reviewed this product.</p>
          </div>
        )}

        {/* Reviews list */}
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6" data-testid="reviews-list">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-xl p-6"
                data-testid="review-item"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <StarRating rating={review.rating} />
                    <h4 className="font-semibold text-gray-900 mt-2" data-testid="review-item-title">
                      {review.title}
                    </h4>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-4" data-testid="review-item-date">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed" data-testid="review-item-body">
                  {review.body}
                </p>
                {review.user && (
                  <p className="text-xs text-gray-400 mt-3">
                    — {review.user.firstName} {review.user.lastName}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400" data-testid="no-reviews">
            <p className="text-lg">No reviews yet.</p>
            <p className="text-sm mt-1">Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
