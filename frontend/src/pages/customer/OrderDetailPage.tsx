import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import { OrderStatusBadge } from '../../molecules/OrderStatusBadge';
import { Button } from '../../atoms/Button';
import { PageSpinner } from '../../atoms/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const CANCELLABLE_STATUSES = ['PENDING', 'CONFIRMED'];

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [confirmCancel, setConfirmCancel] = React.useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60,
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancel(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setConfirmCancel(false);
    },
  });

  if (isLoading) return <PageSpinner />;
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found.</div>;

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="max-w-3xl" data-testid="order-detail-page">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/orders" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← Orders
        </Link>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" data-testid="order-detail-number">
            {order.orderNumber}
          </h1>
          <p className="text-sm text-gray-500 mt-1" data-testid="order-detail-date">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} data-testid="order-detail-status" />
          {canCancel && !confirmCancel && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmCancel(true)}
              data-testid="cancel-order-button"
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Cancel confirmation */}
      {confirmCancel && (
        <div
          className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
          data-testid="cancel-confirm-dialog"
        >
          <p className="text-sm text-red-700">Are you sure you want to cancel this order?</p>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmCancel(false)}
              data-testid="cancel-confirm-no"
            >
              Keep Order
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => cancelMutation.mutate()}
              loading={cancelMutation.isPending}
              data-testid="cancel-confirm-yes"
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid="order-detail-items">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-4" data-testid="order-detail-item">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {item.product.imageUrls?.[0] ? (
                      <img
                        src={item.product.imageUrls[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product.slug}`}>
                      <p className="font-medium text-gray-900 hover:text-indigo-600 transition-colors truncate">
                        {item.product.name}
                      </p>
                    </Link>
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
          <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="order-detail-address">
            <h2 className="font-semibold text-gray-900 mb-3">Shipping Address</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-800">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state} {order.address.zipCode}
              </p>
              <p>{order.address.country}</p>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid="order-detail-summary">
            <h2 className="font-semibold text-gray-900 mb-4">Summary</h2>
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
                <span>
                  {Number(order.shippingCost) === 0 ? 'Free' : formatCurrency(Number(order.shippingCost))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatCurrency(Number(order.tax))}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span data-testid="order-detail-total">{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
