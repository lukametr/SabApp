'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';

export default function SubscriptionBanner() {
  const { user, token } = useAuthStore();
  const { subscriptionInfo, loading, error, checkSubscription } = useSubscriptionStore();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (token && user) {
      checkSubscription(token);
    }
  }, [token, user, checkSubscription]);

  // Don't show banner if dismissed, loading, or user is admin
  if (dismissed || loading || !user || user.role === 'admin') {
    return null;
  }

  // Show payment required banner if subscription expired or error
  if (error || (subscriptionInfo && !subscriptionInfo.isActive)) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Subscription Required
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {error || 'Your subscription has expired. Please contact admin for renewal to continue using the service.'}
                </p>
                {subscriptionInfo && subscriptionInfo.endDate && (
                  <p className="mt-1">
                    Expired on: {new Date(subscriptionInfo.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setDismissed(true)}
              className="rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription info if active
  if (subscriptionInfo && subscriptionInfo.isActive) {
    const daysRemaining = subscriptionInfo.daysRemaining;
    const isExpiringSoon = daysRemaining <= 7;

    return (
      <div className={`${isExpiringSoon ? 'bg-yellow-50 border-yellow-400' : 'bg-green-50 border-green-400'} border-l-4 p-4 mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${isExpiringSoon ? 'text-yellow-400' : 'text-green-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.107 10.5a.75.75 0 00-1.214 1.029l2.5 3.5a.75.75 0 001.214 0l4-5.619z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${isExpiringSoon ? 'text-yellow-800' : 'text-green-800'}`}>
                {isExpiringSoon ? 'Subscription Expiring Soon' : 'Subscription Active'}
              </h3>
              <div className={`mt-2 text-sm ${isExpiringSoon ? 'text-yellow-700' : 'text-green-700'}`}>
                <p>
                  {daysRemaining === 0 ? 'Expires today' :
                   daysRemaining === 1 ? 'Expires tomorrow' :
                   `${daysRemaining} days remaining`}
                </p>
                {subscriptionInfo.endDate && (
                  <p className="mt-1">
                    Valid until: {new Date(subscriptionInfo.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setDismissed(true)}
              className={`rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isExpiringSoon 
                  ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50'
                  : 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
