import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../../services/cart.service';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { QuantitySelector } from '../../molecules/QuantitySelector';
import { CouponInput } from '../../molecules/CouponInput';
import { Button } from '../../atoms/Button';
import { PageSpinner } from '../../atoms/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const subtotal = useCartStore((s) => s.subtotal);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const shippingCost = useCartStore((s) => s.shippingCost);
  const tax = useCartStore((s) => s.tax);
  const total = useCartStore((s) => s.total);

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
    staleTime: 0,
  });

  React.useEffect(() => {
    if (cartData) syncFromServer(cartData);
  }, [cartData]);

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: (cart) => {
      syncFromServer(cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: (cart) => {
      syncFromServer(cart);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center py-20" data-testid="cart-login-prompt">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart</h2>
        <p className="text-gray-500 mb-6">Sign in to view and manage your cart</p>
        <Link to="/login?returnUrl=/cart">
          <Button data-testid="cart-login-button">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) return <PageSpinner />;

  if (items.length === 0) {
    return (
      <div className="text-center py-20" data-testid="empty-cart">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link to="/shop">
          <Button data-testid="empty-cart-shop-button">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="cart-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Shopping Cart{' '}
        <span className="text-gray-400 font-normal text-lg" data-testid="cart-item-count">
          ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4" data-testid="cart-items">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4"
              data-testid="cart-item"
              data-product-id={item.productId}
            >
              <Link to={`/products/${item.product.slug}`} className="shrink-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  {item.product.imageUrls[0] ? (
                    <img
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                      📦
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product.slug}`}>
                  <h3
                    className="font-medium text-gray-900 hover:text-indigo-600 transition-colors truncate"
                    data-testid="cart-item-name"
                  >
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-0.5" data-testid="cart-item-unit-price">
                  {formatCurrency(Number(item.product.price))} each
                </p>

                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <QuantitySelector
                    quantity={item.quantity}
                    onDecrease={() =>
                      updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                    }
                    onIncrease={() =>
                      updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })
                    }
                    min={1}
                    max={item.product.stock}
                    disabled={updateMutation.isPending}
                    data-testid={`cart-item-quantity-${item.id}`}
                  />

                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-900" data-testid="cart-item-total">
                      {formatCurrency(Number(item.product.price) * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeMutation.mutate(item.id)}
                      disabled={removeMutation.isPending}
                      className="text-gray-400 hover:text-red-500 transition-colors text-lg"
                      aria-label="Remove item"
                      data-testid="cart-item-remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div
            className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6"
            data-testid="cart-summary"
          >
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="mb-5">
              <CouponInput />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span data-testid="cart-subtotal">{formatCurrency(subtotal())}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({coupon.code})</span>
                  <span data-testid="cart-discount">−{formatCurrency(discountAmount())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span data-testid="cart-shipping">
                  {shippingCost() === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatCurrency(shippingCost())
                  )}
                </span>
              </div>
              {shippingCost() > 0 && (
                <p className="text-xs text-gray-400">Free shipping on orders over $100</p>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span data-testid="cart-tax">{formatCurrency(tax())}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-200">
                <span>Total</span>
                <span data-testid="cart-total">{formatCurrency(total())}</span>
              </div>
            </div>

            <Button
              fullWidth
              className="mt-6"
              onClick={() => navigate('/checkout')}
              data-testid="checkout-button"
            >
              Proceed to Checkout
            </Button>

            <Link
              to="/shop"
              className="block text-center text-sm text-indigo-600 hover:text-indigo-700 mt-3 transition-colors"
              data-testid="continue-shopping-link"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
