import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { cartService } from '../services/cart.service';
import { useCartStore } from '../stores/cartStore';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export const CouponInput: React.FC = () => {
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');

  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const subtotal = useCartStore((s) => s.subtotal);

  const { mutate, isPending } = useMutation({
    mutationFn: () => cartService.validateCoupon(code.trim(), subtotal()),
    onSuccess: (data) => {
      applyCoupon(data);
      setCode('');
      setError('');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Invalid coupon code');
    },
  });

  if (coupon) {
    return (
      <div
        className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3"
        data-testid="coupon-applied"
      >
        <div>
          <span className="text-sm font-medium text-green-800" data-testid="coupon-applied-code">
            {coupon.code}
          </span>
          <span className="text-xs text-green-600 ml-2">applied</span>
        </div>
        <button
          onClick={removeCoupon}
          className="text-xs text-red-500 hover:text-red-700 transition-colors"
          data-testid="coupon-remove-button"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div data-testid="coupon-input-container">
      <div className="flex gap-2">
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError('');
          }}
          className="flex-1"
          data-testid="coupon-code-input"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => mutate()}
          loading={isPending}
          disabled={!code.trim()}
          data-testid="coupon-apply-button"
        >
          Apply
        </Button>
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1" data-testid="coupon-error">
          {error}
        </p>
      )}
    </div>
  );
};
