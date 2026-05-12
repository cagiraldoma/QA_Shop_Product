import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../organisms/Navbar';
import { CartSidebar } from '../organisms/CartSidebar';

const Footer: React.FC = () => (
  <footer className="bg-gray-50 border-t border-gray-200 mt-auto" data-testid="footer">
    <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} QA Shop — Built for end-to-end testing practice</p>
    </div>
  </footer>
);

export const CustomerLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <CartSidebar />
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" data-testid="main-content">
      <Outlet />
    </main>
    <Footer />
  </div>
);
