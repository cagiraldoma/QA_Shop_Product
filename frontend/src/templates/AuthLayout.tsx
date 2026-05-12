import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" data-testid="auth-layout">
    <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-indigo-600 mb-8" data-testid="auth-logo">
      <span>🛍️</span>
      <span>QA Shop</span>
    </Link>
    <div className="w-full max-w-md">
      <Outlet />
    </div>
  </div>
);
