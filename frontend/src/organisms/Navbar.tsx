import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalItems, toggleCart } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600" data-testid="navbar-logo">
            <span>🛍️</span>
            <span>QA Shop</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="text-gray-600 hover:text-gray-900 text-sm font-medium" data-testid="navbar-shop-link">
              Shop
            </Link>
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900 text-sm font-medium" data-testid="navbar-admin-link">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-gray-900"
              aria-label="Open cart"
              data-testid="navbar-cart-button"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-indigo-600 text-white text-xs font-bold rounded-full" data-testid="navbar-cart-count">
                  {totalItems()}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-gray-900" data-testid="navbar-profile-link">
                  {user?.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                  data-testid="navbar-logout-button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                data-testid="navbar-login-link"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
