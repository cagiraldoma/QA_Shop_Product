import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import { OrderStatusBadge } from '../../molecules/OrderStatusBadge';
import { Button } from '../../atoms/Button';
import { PageSpinner } from '../../atoms/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id!),
    enabled: !!id,
    staleTime: 1000 * 60,
  });

  if (isLoading) return <PageSpinner />;
  if (!order) return <div className="text-center py-16 text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto" data-testid="order-confirmation-page">
      {/* Success header */}
      <div className="text-center mb-10" data-testid="confirmation-header">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Confirmed!</h1>
        <p className="text-gray-500">Thank you for your purchase. We'll email you when it ships.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Order meta */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
              <p className="font-bold text-gray-900 text-lg" data-testid="order-number">
                {order.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
              <p className="text-sm text-gray-700" data-testid="order-date">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <OrderStatusBadge status={order.status} data-testid="order-status" />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="p-6 border-b border-gray-100" data-testid="confirmation-items">
          <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3" data-testid="confirmation-item">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
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
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(Number(item.priceAtTime) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping address */}
        <div className="p-6 border-b border-gray-100" data-testid="confirmation-address">
          <h2 className="font-semibold text-gray-900 mb-2">Shipping To</h2>
          <div className="text-sm text-gray-600 space-y-0.5">
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

        {/* Totals */}
        <div className="p-6 bg-gray-50" data-testid="confirmation-totals">
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
              <span data-testid="confirmation-total">{formatCurrency(Number(order.total))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Link to="/orders" className="flex-1">
          <Button variant="secondary" fullWidth data-testid="view-orders-button">
            View My Orders
          </Button>
        </Link>
        <Link to="/shop" className="flex-1">
          <Button fullWidth data-testid="continue-shopping-button">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
