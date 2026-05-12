import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerLayout } from '../templates/CustomerLayout';
import { AdminLayout } from '../templates/AdminLayout';
import { AuthLayout } from '../templates/AuthLayout';
import { RequireAuth } from './RequireAuth';
import { PageSpinner } from '../atoms/Spinner';

// Auth pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Customer pages
const HomePage = lazy(() => import('../pages/customer/HomePage'));
const ShopPage = lazy(() => import('../pages/customer/ShopPage'));
const ProductDetailPage = lazy(() => import('../pages/customer/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/customer/CartPage'));
const CheckoutPage = lazy(() => import('../pages/customer/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('../pages/customer/OrderConfirmationPage'));
const OrdersPage = lazy(() => import('../pages/customer/OrdersPage'));
const OrderDetailPage = lazy(() => import('../pages/customer/OrderDetailPage'));
const ProfilePage = lazy(() => import('../pages/customer/ProfilePage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('../pages/admin/ProductsPage'));
const AdminProductFormPage = lazy(() => import('../pages/admin/ProductFormPage'));
const AdminCategoriesPage = lazy(() => import('../pages/admin/CategoriesPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
const AdminOrderDetailPage = lazy(() => import('../pages/admin/OrderDetailPage'));
const AdminUsersPage = lazy(() => import('../pages/admin/UsersPage'));
const AdminCouponsPage = lazy(() => import('../pages/admin/CouponsPage'));

const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Customer */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/category/:categorySlug" element={<ShopPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<RequireAuth role="ADMIN" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/new" element={<AdminProductFormPage />} />
            <Route path="/admin/products/:id/edit" element={<AdminProductFormPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/coupons" element={<AdminCouponsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
