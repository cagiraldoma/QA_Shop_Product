import React from 'react';
import { Badge } from '../atoms/Badge';
import type { OrderStatus } from '../types/order.types';

const statusConfig = {
  PENDING: { color: 'yellow' as const, label: 'Pending' },
  CONFIRMED: { color: 'blue' as const, label: 'Confirmed' },
  PROCESSING: { color: 'indigo' as const, label: 'Processing' },
  SHIPPED: { color: 'purple' as const, label: 'Shipped' },
  DELIVERED: { color: 'green' as const, label: 'Delivered' },
  CANCELLED: { color: 'red' as const, label: 'Cancelled' },
  REFUNDED: { color: 'gray' as const, label: 'Refunded' },
};

interface OrderStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, ...props }) => {
  const config = statusConfig[status as unknown as keyof typeof statusConfig];
  const color = config?.color ?? 'gray';
  const label = config?.label ?? status;
  
  return (
    <Badge color={color} data-testid="order-status-badge" {...props}>
      {label}
    </Badge>
  );
};
