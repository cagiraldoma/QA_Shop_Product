import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import type { OrderStatus } from '../../types/order.types';
import { OrderStatusBadge } from '../../molecules/OrderStatusBadge';
import { Button } from '../../atoms/Button';
import { PageSpinner } from '../../atoms/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const ALL_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
];

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus | ''>('');
  const [statusSuccess, setStatusSuccess] = React.useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => orderService.getById(id!),
    enabled: !!id,
    staleTime: 30_000,
  });

  React.useEffect(() => {
    if (order) setSelectedStatus(order.status);
  }, [order]);

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => orderService.updateStatus(id!, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setSelectedStatus(updated.status);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 3000);
    },
  });

  if (isLoading) return <PageSpinner />;
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-4xl" data-testid="admin-order-detail-page">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/orders" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Orders
        </Link>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="admin-order-detail-number">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1" data-testid="admin-order-detail-date">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} data-testid="admin-order-detail-status" />
      </div>

      {/* Status update */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6" data-testid="admin-order-status-update">
        <h2 className="font-semibold text-gray-900 mb-3">Update Status</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="admin-order-status-select"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={() => updateStatusMutation.mutate(selectedStatus as string)}
            loading={updateStatusMutation.isPending}
            disabled={selectedStatus === order.status}
            data-testid="admin-order-status-save"
          >
            Update Status
          </Button>
          {statusSuccess && (
            <span className="text-sm text-green-600" data-testid="admin-order-status-success">
              Status updated!
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid="admin-order-items">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Items ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-4" data-testid="admin-order-item">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.product.imageUrls?.[0] ? (
                      <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(Number(item.priceAtTime))} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(Number(item.priceAtTime) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="admin-order-address">
            <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-800">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
              <p>{order.address.country}</p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="admin-order-notes">
              <h2 className="font-semibold text-gray-900 mb-2">Order Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6" data-testid="admin-order-summary">
            <h2 className="font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(Number(order.subtotal))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                  <span>−{formatCurrency(Number(order.discountAmount))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{Number(order.shippingCost) === 0 ? 'Free' : formatCurrency(Number(order.shippingCost))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatCurrency(Number(order.tax))}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span data-testid="admin-order-total">{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
