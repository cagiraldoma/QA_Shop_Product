import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = React.useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const { user, accessToken } = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      setAuth(user, accessToken);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8" data-testid="register-form-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
      <p className="text-gray-500 text-sm mb-6">Join QA Shop today</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4" data-testid="register-form">
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert" data-testid="register-error">
            <p className="text-red-600 text-sm">{serverError}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input label="First name" error={errors.firstName?.message} data-testid="register-firstname-input" {...register('firstName')} />
          <Input label="Last name" error={errors.lastName?.message} data-testid="register-lastname-input" {...register('lastName')} />
        </div>

        <Input label="Email" type="email" error={errors.email?.message} autoComplete="email" data-testid="register-email-input" {...register('email')} />
        <Input label="Password" type="password" error={errors.password?.message} data-testid="register-password-input" {...register('password')} />
        <Input label="Confirm password" type="password" error={errors.confirmPassword?.message} data-testid="register-confirm-password-input" {...register('confirmPassword')} />

        <Button type="submit" fullWidth loading={isSubmitting} data-testid="register-submit-button">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium" data-testid="login-link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
