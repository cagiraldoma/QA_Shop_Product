import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import { userService } from '../../services/user.service';
import { useCartStore } from '../../stores/cartStore';
import type { Address } from '../../types/order.types';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { PageSpinner } from '../../atoms/Spinner';
import { CouponInput } from '../../molecules/CouponInput';
import { formatCurrency } from '../../utils/formatCurrency';

type Step = 1 | 2;

const emptyAddr: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  type: 'SHIPPING',
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
  isDefault: false,
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const subtotal = useCartStore((s) => s.subtotal);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const shippingCost = useCartStore((s) => s.shippingCost);
  const tax = useCartStore((s) => s.tax);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = React.useState<Step>(1);
  const [selectedAddressId, setSelectedAddressId] = React.useState('');
  const [useNewAddress, setUseNewAddress] = React.useState(false);
  const [newAddr, setNewAddr] = React.useState(emptyAddr);
  const [notes, setNotes] = React.useState('');
  const [checkoutError, setCheckoutError] = React.useState('');

  const { data: addresses, isLoading: loadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: userService.getAddresses,
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(def.id);
    }
    if (addresses && addresses.length === 0) {
      setUseNewAddress(true);
    }
  }, [addresses]);

  const saveAddressMutation = useMutation({
    mutationFn: () => userService.createAddress(newAddr),
  });

  const checkoutMutation = useMutation({
    mutationFn: (addressId: string) =>
      orderService.checkout({
        addressId,
        couponCode: coupon?.code,
        notes: notes || undefined,
      }),
    onSuccess: (order) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(`/order-confirmation/${order.id}`, { replace: true });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCheckoutError(msg || 'Checkout failed. Please try again.');
    },
  });

  const handleContinue = async () => {
    if (useNewAddress) {
      if (!newAddr.firstName || !newAddr.lastName || !newAddr.street || !newAddr.city || !newAddr.zipCode) {
        setCheckoutError('Please fill in all required address fields.');
        return;
      }
    } else if (!selectedAddressId) {
      setCheckoutError('Please select a shipping address.');
      return;
    }
    setCheckoutError('');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setCheckoutError('');
    if (useNewAddress) {
      const saved = await saveAddressMutation.mutateAsync();
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      checkoutMutation.mutate(saved.id);
    } else {
      checkoutMutation.mutate(selectedAddressId);
    }
  };

  if (items.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto" data-testid="checkout-page">
      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8" data-testid="checkout-steps">
        <div className={`flex items-center gap-2 text-sm font-medium ${step === 1 ? 'text-indigo-600' : 'text-gray-400'}`} data-testid="checkout-step-1">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </span>
          Shipping Address
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className={`flex items-center gap-2 text-sm font-medium ${step === 2 ? 'text-indigo-600' : 'text-gray-400'}`} data-testid="checkout-step-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </span>
          Review & Confirm
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="checkout-address-step">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>

              {loadingAddresses ? (
                <PageSpinner />
              ) : (
                <>
                  {addresses && addresses.length > 0 && (
                    <div className="space-y-3 mb-6" data-testid="address-list">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === addr.id && !useNewAddress
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          data-testid={`address-option-${addr.id}`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={addr.id}
                            checked={selectedAddressId === addr.id && !useNewAddress}
                            onChange={() => {
                              setSelectedAddressId(addr.id);
                              setUseNewAddress(false);
                            }}
                            className="mt-1"
                            data-testid={`address-radio-${addr.id}`}
                          />
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {addr.firstName} {addr.lastName}
                              {addr.isDefault && (
                                <span className="ml-2 text-xs text-indigo-600 font-normal">(default)</span>
                              )}
                            </p>
                            <p className="text-gray-500">{addr.street}</p>
                            <p className="text-gray-500">
                              {addr.city}, {addr.state} {addr.zipCode}
                            </p>
                            <p className="text-gray-500">{addr.country}</p>
                          </div>
                        </label>
                      ))}
                      <button
                        onClick={() => setUseNewAddress(true)}
                        className={`w-full flex items-center gap-3 p-4 border-2 border-dashed rounded-lg text-sm transition-colors ${
                          useNewAddress
                            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                            : 'border-gray-300 text-gray-500 hover:border-gray-400'
                        }`}
                        data-testid="use-new-address-button"
                      >
                        + Use a different address
                      </button>
                    </div>
                  )}

                  {/* New address form */}
                  {useNewAddress && (
                    <div className="space-y-4 mb-6" data-testid="new-address-form">
                      <h3 className="font-medium text-gray-800">New Shipping Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          value={newAddr.firstName}
                          onChange={(e) => setNewAddr((a) => ({ ...a, firstName: e.target.value }))}
                          data-testid="addr-first-name"
                        />
                        <Input
                          label="Last Name"
                          value={newAddr.lastName}
                          onChange={(e) => setNewAddr((a) => ({ ...a, lastName: e.target.value }))}
                          data-testid="addr-last-name"
                        />
                      </div>
                      <Input
                        label="Street Address"
                        value={newAddr.street}
                        onChange={(e) => setNewAddr((a) => ({ ...a, street: e.target.value }))}
                        data-testid="addr-street"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <Input
                          label="City"
                          value={newAddr.city}
                          onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))}
                          data-testid="addr-city"
                        />
                        <Input
                          label="State"
                          value={newAddr.state}
                          onChange={(e) => setNewAddr((a) => ({ ...a, state: e.target.value }))}
                          data-testid="addr-state"
                        />
                        <Input
                          label="ZIP Code"
                          value={newAddr.zipCode}
                          onChange={(e) => setNewAddr((a) => ({ ...a, zipCode: e.target.value }))}
                          data-testid="addr-zip"
                        />
                      </div>
                      <Input
                        label="Country"
                        value={newAddr.country}
                        onChange={(e) => setNewAddr((a) => ({ ...a, country: e.target.value }))}
                        data-testid="addr-country"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={newAddr.isDefault}
                          onChange={(e) => setNewAddr((a) => ({ ...a, isDefault: e.target.checked }))}
                          data-testid="addr-is-default"
                        />
                        Save as default address
                      </label>
                    </div>
                  )}

                  {checkoutError && (
                    <p className="text-sm text-red-600 mb-4" data-testid="checkout-error">{checkoutError}</p>
                  )}

                  <Button fullWidth onClick={handleContinue} data-testid="continue-to-review-button">
                    Continue to Review
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="checkout-review-step">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Your Order</h2>

              {/* Items */}
              <div className="space-y-3 mb-6" data-testid="checkout-items">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3" data-testid="checkout-item">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {item.product.imageUrls[0] ? (
                        <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Coupon Code</h3>
                <CouponInput />
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-testid="order-notes-input"
                />
              </div>

              {checkoutError && (
                <p className="text-sm text-red-600 mb-4" data-testid="checkout-error">{checkoutError}</p>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} data-testid="back-to-address-button">
                  Back
                </Button>
                <Button
                  fullWidth
                  onClick={handlePlaceOrder}
                  loading={checkoutMutation.isPending || saveAddressMutation.isPending}
                  data-testid="place-order-button"
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6" data-testid="checkout-summary">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span data-testid="checkout-subtotal">{formatCurrency(subtotal())}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span data-testid="checkout-discount">−{formatCurrency(discountAmount())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span data-testid="checkout-shipping">
                  {shippingCost() === 0 ? 'Free' : formatCurrency(shippingCost())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span data-testid="checkout-tax">{formatCurrency(tax())}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-200">
                <span>Total</span>
                <span data-testid="checkout-total">{formatCurrency(total())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
