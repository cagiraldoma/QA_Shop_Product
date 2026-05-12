import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8" data-testid="forgot-password-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset password</h1>

      {sent ? (
        <div data-testid="forgot-password-success">
          <p className="text-gray-600 mb-4">
            If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
          </p>
          <Link to="/login">
            <Button variant="secondary" fullWidth>Back to Login</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="forgot-password-form">
          <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link.</p>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            data-testid="forgot-password-email-input"
          />
          <Button type="submit" fullWidth data-testid="forgot-password-submit">
            Send Reset Link
          </Button>
          <Link to="/login" className="block text-center text-sm text-indigo-600 hover:text-indigo-700" data-testid="back-to-login-link">
            Back to login
          </Link>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
