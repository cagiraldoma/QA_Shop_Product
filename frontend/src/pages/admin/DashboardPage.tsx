import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';
import { productService } from '../../services/product.service';
import { userService } from '../../services/user.service';
import { OrderStatusBadge } from '../../molecules/OrderStatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const StatCard: React.FC<{ label: string; value: string | number; icon: string; 'data-testid'?: string }> = ({
  label, value, icon, 'data-testid': testId,
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6" data-testid={testId}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const DashboardPage: React.FC = () => {
  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders-stats'],
    queryFn: () => orderService.getAll(1, 10),
    staleTime: 1000 * 60,
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products-stats'],
    queryFn: () => productService.getAll({ limit: 1 }),
    staleTime: 1000 * 60,
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users-stats'],
    queryFn: () => userService.getAll(1),
    staleTime: 1000 * 60,
  });

  return (
    <div data-testid="admin-dashboard-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10" data-testid="dashboard-stats">
        <StatCard
          label="Total Orders"
          value={ordersData?.total ?? '—'}
          icon="📦"
          data-testid="stat-total-orders"
        />
        <StatCard
          label="Total Products"
          value={productsData?.total ?? '—'}
          icon="🛍️"
          data-testid="stat-total-products"
        />
        <StatCard
          label="Total Users"
          value={usersData?.total ?? '—'}
          icon="👥"
          data-testid="stat-total-users"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid="recent-orders">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-700" data-testid="view-all-orders-link">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="recent-orders-table">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordersData?.data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors" data-testid="recent-order-row">
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-700"
                      data-testid="recent-order-number"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500" data-testid="recent-order-date">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right" data-testid="recent-order-total">
                    {formatCurrency(Number(order.total))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!ordersData?.data.length && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
