import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../atoms/Button';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50" data-testid="not-found-page">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-indigo-600 mb-4" data-testid="not-found-code">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h2>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/">
        <Button data-testid="not-found-home-button">Go back home</Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
