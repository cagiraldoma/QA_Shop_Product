import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/products', label: 'Products', icon: '📦', exact: false },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️', exact: false },
  { to: '/admin/orders', label: 'Orders', icon: '🛒', exact: false },
  { to: '/admin/users', label: 'Users', icon: '👥', exact: false },
  { to: '/admin/coupons', label: 'Coupons', icon: '🎟️', exact: false },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-screen" data-testid="admin-layout">
      <aside className="w-64 bg-gray-900 text-white flex flex-col" data-testid="admin-sidebar">
        <div className="p-6 border-b border-gray-700">
          <Link to="/" className="font-bold text-xl text-indigo-400">🛍️ QA Shop</Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
              data-testid={`admin-nav-${item.label.toLowerCase()}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-sm text-gray-300">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <button
            onClick={logout}
            className="text-xs text-red-400 hover:text-red-300 mt-2"
            data-testid="admin-logout-button"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 overflow-auto" data-testid="admin-main">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
