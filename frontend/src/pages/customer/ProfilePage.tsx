import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { useAuthStore } from '../../stores/authStore';
import type { Address } from '../../types/order.types';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { PageSpinner } from '../../atoms/Spinner';

type Tab = 'info' | 'addresses' | 'password';

const infoSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phoneNumber: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type InfoForm = z.infer<typeof infoSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const emptyAddr: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  type: 'SHIPPING',
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
  isDefault: false,
};

// ── Info Tab ─────────────────────────────────────────────────────────────────
const InfoTab: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [success, setSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InfoForm>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phoneNumber: user?.phoneNumber ?? '',
    },
  });

  const onSubmit = async (data: InfoForm) => {
    setServerError('');
    setSuccess(false);
    try {
      const updated = await userService.update(user!.id, data);
      updateUser(updated);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg || 'Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md" data-testid="profile-info-form">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3" data-testid="profile-info-success">
          <p className="text-sm text-green-700">Profile updated successfully!</p>
        </div>
      )}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3" data-testid="profile-info-error">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          error={errors.firstName?.message}
          data-testid="profile-first-name"
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          error={errors.lastName?.message}
          data-testid="profile-last-name"
          {...register('lastName')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={user?.email ?? ''}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          data-testid="profile-email-display"
        />
        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        error={errors.phoneNumber?.message}
        data-testid="profile-phone"
        {...register('phoneNumber')}
      />

      <Button type="submit" loading={isSubmitting} data-testid="profile-info-submit">
        Save Changes
      </Button>
    </form>
  );
};

// ── Addresses Tab ─────────────────────────────────────────────────────────────
const AddressesTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = React.useState(false);
  const [editAddr, setEditAddr] = React.useState<Address | null>(null);
  const [formData, setFormData] = React.useState(emptyAddr);
  const [formError, setFormError] = React.useState('');

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: userService.getAddresses,
    staleTime: 1000 * 60 * 5,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['addresses'] });

  const createMutation = useMutation({
    mutationFn: () => userService.createAddress(formData),
    onSuccess: () => { invalidate(); setShowForm(false); setFormData(emptyAddr); },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Failed to save address');
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => userService.updateAddress(editAddr!.id, formData),
    onSuccess: () => { invalidate(); setEditAddr(null); setFormData(emptyAddr); },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Failed to update address');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteAddress(id),
    onSuccess: () => invalidate(),
  });

  const defaultMutation = useMutation({
    mutationFn: (id: string) => userService.setDefaultAddress(id),
    onSuccess: () => invalidate(),
  });

  const openEdit = (addr: Address) => {
    setEditAddr(addr);
    setFormData({
      type: addr.type,
      firstName: addr.firstName,
      lastName: addr.lastName,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setShowForm(true);
    setFormError('');
  };

  const handleSubmit = () => {
    setFormError('');
    if (!formData.firstName || !formData.lastName || !formData.street || !formData.city || !formData.zipCode) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (editAddr) updateMutation.mutate();
    else createMutation.mutate();
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditAddr(null);
    setFormData(emptyAddr);
    setFormError('');
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div data-testid="profile-addresses-tab">
      {addresses && addresses.length > 0 ? (
        <div className="space-y-4 mb-6" data-testid="addresses-list">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4"
              data-testid="address-card"
              data-address-id={addr.id}
            >
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-medium text-gray-900">
                  {addr.firstName} {addr.lastName}
                  {addr.isDefault && (
                    <span className="ml-2 text-xs text-indigo-600 font-normal bg-indigo-50 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </p>
                <p>{addr.street}</p>
                <p>
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <p>{addr.country}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => defaultMutation.mutate(addr.id)}
                    className="text-xs text-gray-500 hover:text-indigo-600 transition-colors"
                    data-testid="address-set-default"
                  >
                    Set default
                  </button>
                )}
                <button
                  onClick={() => openEdit(addr)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                  data-testid="address-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(addr.id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  data-testid="address-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-6" data-testid="no-addresses">
          No addresses saved yet.
        </p>
      )}

      {!showForm && (
        <Button variant="secondary" onClick={() => { setShowForm(true); setEditAddr(null); setFormData(emptyAddr); }} data-testid="add-address-button">
          + Add Address
        </Button>
      )}

      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-4" data-testid="address-form">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editAddr ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData((a) => ({ ...a, firstName: e.target.value }))} data-testid="addr-form-first-name" />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData((a) => ({ ...a, lastName: e.target.value }))} data-testid="addr-form-last-name" />
            </div>
            <Input label="Street Address" value={formData.street} onChange={(e) => setFormData((a) => ({ ...a, street: e.target.value }))} data-testid="addr-form-street" />
            <div className="grid grid-cols-3 gap-4">
              <Input label="City" value={formData.city} onChange={(e) => setFormData((a) => ({ ...a, city: e.target.value }))} data-testid="addr-form-city" />
              <Input label="State" value={formData.state} onChange={(e) => setFormData((a) => ({ ...a, state: e.target.value }))} data-testid="addr-form-state" />
              <Input label="ZIP" value={formData.zipCode} onChange={(e) => setFormData((a) => ({ ...a, zipCode: e.target.value }))} data-testid="addr-form-zip" />
            </div>
            <Input label="Country" value={formData.country} onChange={(e) => setFormData((a) => ({ ...a, country: e.target.value }))} data-testid="addr-form-country" />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData((a) => ({ ...a, isDefault: e.target.checked }))} data-testid="addr-form-default" />
              Set as default address
            </label>
            {formError && <p className="text-sm text-red-600" data-testid="addr-form-error">{formError}</p>}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={cancelForm} data-testid="addr-form-cancel">Cancel</Button>
              <Button
                onClick={handleSubmit}
                loading={createMutation.isPending || updateMutation.isPending}
                data-testid="addr-form-submit"
              >
                {editAddr ? 'Save Changes' : 'Add Address'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Password Tab ──────────────────────────────────────────────────────────────
const PasswordTab: React.FC = () => {
  const { user } = useAuthStore();
  const [success, setSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordForm) => {
    setServerError('');
    setSuccess(false);
    try {
      await userService.changePassword(user!.id, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      reset();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg || 'Failed to change password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md" data-testid="profile-password-form">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3" data-testid="password-success">
          <p className="text-sm text-green-700">Password changed successfully!</p>
        </div>
      )}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3" data-testid="password-error">
          <p className="text-sm text-red-600">{serverError}</p>
        </div>
      )}
      <Input
        label="Current Password"
        type="password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        data-testid="current-password-input"
        {...register('currentPassword')}
      />
      <Input
        label="New Password"
        type="password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        data-testid="new-password-input"
        {...register('newPassword')}
      />
      <Input
        label="Confirm New Password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        data-testid="confirm-password-input"
        {...register('confirmPassword')}
      />
      <Button type="submit" loading={isSubmitting} data-testid="change-password-submit">
        Change Password
      </Button>
    </form>
  );
};

// ── Profile Page ──────────────────────────────────────────────────────────────
const ProfilePage: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>('info');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Personal Info' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'password', label: 'Password' },
  ];

  return (
    <div data-testid="profile-page">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8" data-testid="profile-tabs">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              tab === key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            data-testid={`profile-tab-${key}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'info' && <InfoTab />}
      {tab === 'addresses' && <AddressesTab />}
      {tab === 'password' && <PasswordTab />}
    </div>
  );
};

export default ProfilePage;
