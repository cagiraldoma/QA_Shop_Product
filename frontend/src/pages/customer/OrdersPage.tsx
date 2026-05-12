import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import { OrderStatusBadge } from '../../molecules/OrderStatusBadge';
import { Button } from '../../atoms/Button';
import { PageSpinner } from '../../atoms/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const OrdersPage: React.FC = () => {
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', page],
    queryFn: () => orderService.getAll(page, 10),
    staleTime: 1000 * 60,
  });

  return (
    <div data-testid="orders-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {isLoading ? (
        <PageSpinner />
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20" data-testid="orders-empty">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">When you place an order it will appear here</p>
          <Link to="/shop">
            <Button data-testid="orders-shop-button">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4" data-testid="orders-list">
            {data?.data.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                data-testid="order-item"
                data-order-id={order.id}
              >
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Number</p>
                    <p className="font-bold text-gray-900" data-testid="order-item-number">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</p>
                    <p className="text-sm text-gray-700" data-testid="order-item-date">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <OrderStatusBadge status={order.status} data-testid="order-item-status" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                    <p className="font-semibold text-gray-900" data-testid="order-item-total">
                      {formatCurrency(Number(order.total))}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="secondary" size="sm" data-testid="order-item-view-button">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8" data-testid="orders-pagination">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                data-testid="orders-pagination-prev"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600" data-testid="orders-pagination-info">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                data-testid="orders-pagination-next"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
