import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import type { OrderStatus } from '../../types/order.types';
import { OrderStatusBadge } from '../../molecules/OrderStatusBadge';
import { Button } from '../../atoms/Button';
import { PageSpinner } from '../../atoms/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const ALL_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
];

const AdminOrdersPage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<OrderStatus | ''>('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', { page, statusFilter }],
    queryFn: () => orderService.getAll(page, 15),
    staleTime: 30_000,
  });

  const filtered = statusFilter
    ? data?.data.filter((o) => o.status === statusFilter)
    : data?.data;

  return (
    <div data-testid="admin-orders-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        {data && (
          <span className="text-sm text-gray-500" data-testid="orders-total">
            {data.total} total
          </span>
        )}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6" data-testid="status-filter">
        <button
          onClick={() => { setStatusFilter(''); setPage(1); }}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            statusFilter === '' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          data-testid="status-filter-all"
        >
          All
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            data-testid={`status-filter-${s.toLowerCase()}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-12"><PageSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="admin-orders-table">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Items</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors" data-testid="admin-order-row" data-order-id={order.id}>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                        data-testid="admin-order-number"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" data-testid="admin-order-date">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} data-testid="admin-order-status" />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" data-testid="admin-order-items">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right" data-testid="admin-order-total">
                      {formatCurrency(Number(order.total))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" data-testid="admin-order-view">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered?.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-400" data-testid="admin-orders-empty">
                No orders found
              </div>
            )}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-gray-100" data-testid="admin-orders-pagination">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} data-testid="admin-orders-prev">Previous</Button>
            <span className="text-sm text-gray-600">{data.page} / {data.totalPages}</span>
            <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} data-testid="admin-orders-next">Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
