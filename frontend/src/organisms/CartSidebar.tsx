import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { cartService } from '../services/cart.service';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../atoms/Button';
import { formatCurrency } from '../utils/formatCurrency';

export const CartSidebar: React.FC = () => {
  const { isOpen, closeCart, items, syncFromServer, total, subtotal, discountAmount, shippingCost, tax, coupon } = useCartStore();
  const queryClient = useQueryClient();

  const handleRemoveItem = async (itemId: string) => {
    const cart = await cartService.removeItem(itemId);
    syncFromServer(cart);
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  const handleUpdateQty = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    const cart = await cartService.updateItem(itemId, quantity);
    syncFromServer(cart);
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={closeCart}
        data-testid="cart-sidebar-overlay"
      />
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
        data-testid="cart-sidebar"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold" data-testid="cart-sidebar-title">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
            data-testid="cart-sidebar-close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8" data-testid="cart-sidebar-empty">
            <p className="text-gray-500">Your cart is empty</p>
            <Button variant="secondary" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y" data-testid="cart-sidebar-items">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 p-4" data-testid="cart-sidebar-item">
                  <img
                    src={item.product.imageUrls[0]}
                    alt={item.product.name}
                    className="h-16 w-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-indigo-600">{formatCurrency(Number(item.product.price))}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="w-6 h-6 flex items-center justify-center border rounded"
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        data-testid="cart-item-decrease-qty"
                      >-</button>
                      <span className="text-sm w-6 text-center" data-testid="cart-item-quantity">{item.quantity}</span>
                      <button
                        className="w-6 h-6 flex items-center justify-center border rounded"
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        data-testid="cart-item-increase-qty"
                      >+</button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500 self-start"
                    aria-label={`Remove ${item.product.name}`}
                    data-testid="cart-item-remove"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span data-testid="cart-subtotal">{formatCurrency(subtotal())}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({coupon.code})</span>
                  <span data-testid="cart-discount">-{formatCurrency(discountAmount())}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span data-testid="cart-shipping">{shippingCost() === 0 ? 'Free' : formatCurrency(shippingCost())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span data-testid="cart-tax">{formatCurrency(tax())}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span data-testid="cart-total">{formatCurrency(total())}</span>
              </div>
              <Link to="/checkout" onClick={closeCart}>
                <Button variant="primary" size="lg" fullWidth data-testid="cart-sidebar-checkout">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};
