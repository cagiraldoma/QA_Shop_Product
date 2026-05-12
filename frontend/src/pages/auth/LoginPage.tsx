import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = React.useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const { user, accessToken } = await authService.login(data);
      setAuth(user, accessToken);
      const returnUrl = searchParams.get('returnUrl') || '/';
      navigate(returnUrl, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg || 'Invalid email or password');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8" data-testid="login-form-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" data-testid="login-form">
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert" data-testid="login-error">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          autoComplete="email"
          data-testid="login-email-input"
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          autoComplete="current-password"
          data-testid="login-password-input"
          {...register('password')}
        />

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700" data-testid="forgot-password-link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={isSubmitting} data-testid="login-submit-button">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium" data-testid="register-link">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
