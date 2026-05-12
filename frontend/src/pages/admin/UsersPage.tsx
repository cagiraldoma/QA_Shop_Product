import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { PageSpinner } from '../../atoms/Spinner';
import { formatDate } from '../../utils/formatCurrency';

const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => userService.getAll(page),
    staleTime: 30_000,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userService.update(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div data-testid="admin-users-page">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {data && (
          <span className="text-sm text-gray-500" data-testid="users-total">{data.total} total</span>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-12"><PageSpinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="users-table">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors" data-testid="user-row" data-user-id={user.id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900" data-testid="user-row-name">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500" data-testid="user-row-email">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        color={user.role === 'ADMIN' ? 'indigo' : 'gray'}
                        data-testid="user-row-role"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                        data-testid="user-row-status"
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" data-testid="user-row-joined">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant={user.isActive ? 'ghost' : 'secondary'}
                        size="sm"
                        onClick={() =>
                          toggleActiveMutation.mutate({ id: user.id, isActive: !user.isActive })
                        }
                        loading={toggleActiveMutation.isPending}
                        data-testid="user-row-toggle-active"
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.data.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-400" data-testid="users-empty">
                No users found
              </div>
            )}
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-gray-100" data-testid="users-pagination">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} data-testid="users-prev">Previous</Button>
            <span className="text-sm text-gray-600">{data.page} / {data.totalPages}</span>
            <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} data-testid="users-next">Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
