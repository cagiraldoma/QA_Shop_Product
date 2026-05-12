import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  'data-testid'?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max,
  disabled = false,
  'data-testid': testId = 'quantity-selector',
}) => (
  <div
    className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden"
    data-testid={testId}
  >
    <button
      type="button"
      onClick={onDecrease}
      disabled={disabled || quantity <= min}
      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      data-testid={`${testId}-decrease`}
    >
      −
    </button>
    <span
      className="px-4 py-2 text-sm font-medium text-gray-900 min-w-[2.5rem] text-center border-x border-gray-300"
      data-testid={`${testId}-value`}
    >
      {quantity}
    </span>
    <button
      type="button"
      onClick={onIncrease}
      disabled={disabled || (max !== undefined && quantity >= max)}
      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      data-testid={`${testId}-increase`}
    >
      +
    </button>
  </div>
);
