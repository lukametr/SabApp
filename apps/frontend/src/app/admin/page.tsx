'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, SubscriptionInfo, GrantSubscriptionRequest } from '@/types/user';
import { useRouter } from 'next/navigation';

interface UserWithSubscription extends User {
  subscription?: {
    isActive: boolean;
    daysRemaining: number;
    status: string;
  };
}

export default function AdminPanel() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantForm, setGrantForm] = useState({
    days: 30,
    paymentAmount: 0,
    paymentNote: ''
  });

  // Check if user is authenticated
  useEffect(() => {
    console.log('🔍 Admin page - user check:', { user, role: user?.role, isAdmin: user?.role === 'admin' });
    
    if (!user || !token) {
      console.log('⚠️ No user or token found, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }
    
    // For now, allow any authenticated user to access admin panel for debugging
    console.log('✅ User is authenticated, allowing access');
  }, [user, token, router]);

  // Load users with subscription info
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/subscription/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.data || []);
        } else {
          console.error('Failed to load users');
        }
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.role === 'admin') {
      loadUsers();
    }
  }, [token, user]);

  const handleGrantSubscription = async () => {
    if (!selectedUser) return;

    try {
      const payload: GrantSubscriptionRequest = {
        userId: selectedUser.id,
        days: grantForm.days,
        paymentAmount: grantForm.paymentAmount || undefined,
        paymentNote: grantForm.paymentNote || undefined,
      };

      const response = await fetch('/api/subscription/grant', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Reload users list
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to grant subscription'}`);
      }
    } catch (error) {
      console.error('Error granting subscription:', error);
      alert('Error granting subscription');
    } finally {
      setShowGrantModal(false);
      setSelectedUser(null);
      setGrantForm({ days: 30, paymentAmount: 0, paymentNote: '' });
    }
  };

  const handleRevokeSubscription = async (userId: string) => {
    if (!confirm('Are you sure you want to revoke this subscription?')) return;

    try {
      const response = await fetch('/api/subscription/revoke', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          reason: 'Revoked by admin'
        }),
      });

      if (response.ok) {
        // Reload users list
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to revoke subscription'}`);
      }
    } catch (error) {
      console.error('Error revoking subscription:', error);
      alert('Error revoking subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage user subscriptions</p>
            </div>
            <div className="text-sm text-gray-500">
              Welcome, {user.name}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Active Subscriptions</div>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.subscription?.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Expired Subscriptions</div>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.subscriptionStatus === 'expired').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">No Subscription</div>
            <div className="text-2xl font-bold text-gray-500">
              {users.filter(u => !u.subscriptionStatus || u.subscriptionStatus === 'pending').length}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Users & Subscriptions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.subscription?.isActive ? 'bg-green-100 text-green-800' :
                        user.subscriptionStatus === 'expired' ? 'bg-red-100 text-red-800' :
                        user.subscriptionStatus === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.subscription?.isActive ? 'Active' : 
                         user.subscriptionStatus || 'None'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.subscription?.isActive ? `${user.subscription.daysRemaining} days` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastPaymentDate ? 
                        new Date(user.lastPaymentDate).toLocaleDateString() : '-'}
                      {user.paymentAmount ? (
                        <div className="text-xs text-gray-500">₾{user.paymentAmount}</div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowGrantModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded"
                      >
                        Grant Access
                      </button>
                      {user.subscription?.isActive && (
                        <button
                          onClick={() => handleRevokeSubscription(user.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grant Subscription Modal */}
      {showGrantModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Grant Subscription to {selectedUser.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Days</label>
                  <input
                    type="number"
                    value={grantForm.days}
                    onChange={(e) => setGrantForm(prev => ({ ...prev, days: parseInt(e.target.value) || 0 }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Amount (₾)</label>
                  <input
                    type="number"
                    value={grantForm.paymentAmount}
                    onChange={(e) => setGrantForm(prev => ({ ...prev, paymentAmount: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Note</label>
                  <textarea
                    value={grantForm.paymentNote}
                    onChange={(e) => setGrantForm(prev => ({ ...prev, paymentNote: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Payment details or note..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowGrantModal(false);
                    setSelectedUser(null);
                    setGrantForm({ days: 30, paymentAmount: 0, paymentNote: '' });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGrantSubscription}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Grant Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
