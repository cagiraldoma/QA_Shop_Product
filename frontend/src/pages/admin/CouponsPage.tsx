import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponService, type CreateCouponDto } from '../../services/coupon.service';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { PageSpinner } from '../../atoms/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const emptyForm: CreateCouponDto = {
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: 10,
  minimumAmount: null,
  maximumDiscount: null,
  usageLimit: null,
  isActive: true,
  expiresAt: null,
};

const AdminCouponsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState<CreateCouponDto>(emptyForm);
  const [formError, setFormError] = React.useState('');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons', page],
    queryFn: () => couponService.getAll(page),
    staleTime: 30_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });

  const createMutation = useMutation({
    mutationFn: () => couponService.create(form),
    onSuccess: () => { invalidate(); setShowForm(false); setForm(emptyForm); setFormError(''); },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create coupon');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      couponService.update(id, { isActive }),
    onSuccess: () => invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => couponService.delete(id),
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  const set = <K extends keyof CreateCouponDto>(key: K, value: CreateCouponDto[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.code.trim()) { setFormError('Coupon code is required.'); return; }
    if (!form.discountValue || form.discountValue <= 0) { setFormError('Discount value must be positive.'); return; }
    setFormError('');
    createMutation.mutate();
  };

  return (
    <div data-testid="admin-coupons-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} data-testid="create-coupon-button">
            + New Coupon
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8" data-testid="coupon-form">
          <h2 className="font-semibold text-gray-900 mb-5">New Coupon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <Input
              label="Code *"
              value={form.code}
              onChange={(e) => set('code', e.target.value.toUpperCase())}
              placeholder="e.g. SAVE20"
              data-testid="coupon-form-code"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => set('discountType', e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-testid="coupon-form-type"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
              </select>
            </div>
            <Input
              label={`Discount Value *${form.discountType === 'PERCENTAGE' ? ' (%)' : ' ($)'}`}
              type="number"
              min="0"
              step="0.01"
              value={form.discountValue}
              onChange={(e) => set('discountValue', parseFloat(e.target.value) || 0)}
              data-testid="coupon-form-value"
            />
            <Input
              label="Minimum Order Amount ($)"
              type="number"
              min="0"
              step="0.01"
              placeholder="No minimum"
              value={form.minimumAmount ?? ''}
              onChange={(e) => set('minimumAmount', e.target.value ? parseFloat(e.target.value) : null)}
              data-testid="coupon-form-min-amount"
            />
            {form.discountType === 'PERCENTAGE' && (
              <Input
                label="Maximum Discount ($)"
                type="number"
                min="0"
                step="0.01"
                placeholder="No cap"
                value={form.maximumDiscount ?? ''}
                onChange={(e) => set('maximumDiscount', e.target.value ? parseFloat(e.target.value) : null)}
                data-testid="coupon-form-max-discount"
              />
            )}
            <Input
              label="Usage Limit"
              type="number"
              min="1"
              placeholder="Unlimited"
              value={form.usageLimit ?? ''}
              onChange={(e) => set('usageLimit', e.target.value ? parseInt(e.target.value, 10) : null)}
              data-testid="coupon-form-usage-limit"
            />
            <Input
              label="Expires At"
              type="datetime-local"
              value={form.expiresAt ?? ''}
              onChange={(e) => set('expiresAt', e.target.value || null)}
              data-testid="coupon-form-expires-at"
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="coupon-active"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                data-testid="coupon-form-is-active"
              />
              <label htmlFor="coupon-active" className="text-sm text-gray-700">Active</label>
            </div>
          </div>
          {formError && <p className="text-sm text-red-600 mt-3" data-testid="coupon-form-error">{formError}</p>}
          <div className="flex gap-3 mt-5">
            <Button variant="secondary" onClick={() => { setShowForm(false); setForm(emptyForm); setFormError(''); }} data-testid="coupon-form-cancel">Cancel</Button>
            <Button onClick={handleSubmit} loading={createMutation.isPending} data-testid="coupon-form-submit">
              Create Coupon
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-12"><PageSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="coupons-table">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Constraints</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors" data-testid="coupon-row" data-coupon-id={coupon.id}>
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-gray-900" data-testid="coupon-row-code">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700" data-testid="coupon-row-discount">
                      {coupon.discountType === 'PERCENTAGE'
                        ? `${coupon.discountValue}%`
                        : formatCurrency(coupon.discountValue)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500" data-testid="coupon-row-constraints">
                      {coupon.minimumAmount ? `Min: ${formatCurrency(coupon.minimumAmount)}` : '—'}
                      {coupon.maximumDiscount ? ` · Max: ${formatCurrency(coupon.maximumDiscount)}` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600" data-testid="coupon-row-usage">
                      {coupon.usageCount}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" data-testid="coupon-row-expires">
                      {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleMutation.mutate({ id: coupon.id, isActive: !coupon.isActive })}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          coupon.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        data-testid="coupon-row-toggle"
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {deleteId === coupon.id ? (
                        <div className="flex gap-1 justify-end">
                          <Button variant="danger" size="sm" onClick={() => deleteMutation.mutate(coupon.id)} loading={deleteMutation.isPending} data-testid="coupon-row-delete-confirm">Delete</Button>
                          <Button variant="secondary" size="sm" onClick={() => setDeleteId(null)} data-testid="coupon-row-delete-cancel">Cancel</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(coupon.id)} data-testid="coupon-row-delete">Delete</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.data.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-400" data-testid="coupons-empty">No coupons yet</div>
            )}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-gray-100" data-testid="coupons-pagination">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} data-testid="coupons-prev">Previous</Button>
            <span className="text-sm text-gray-600">{data.page} / {data.totalPages}</span>
            <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} data-testid="coupons-next">Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCouponsPage;
