'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../../store/authStore';
import api from '../../../../lib/api';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const storedState = localStorage.getItem('google_oauth_state');
        
        if (!code) {
          setError('Authorization code not found');
          setStatus('error');
          return;
        }

        if (!state) {
          // If no state in URL, check if this is a signin attempt
          const storedState = localStorage.getItem('google_oauth_state');
          if (storedState === 'signin_attempt') {
            console.log('✅ Valid signin attempt without state parameter');
            localStorage.removeItem('google_oauth_state');
          } else {
            setError('Invalid state parameter');
            setStatus('error');
            return;
          }
        } else if (state !== storedState) {
          setError('Invalid state parameter');
          setStatus('error');
          return;
        } else {
          // Clean up stored state for normal flow
          localStorage.removeItem('google_oauth_state');
        }

        // Send authorization code to backend
        const response = await api.post('/auth/google/callback', {
          code,
          state,
        });

        if (response.data.accessToken) {
          login(response.data);
          setStatus('success');
          
          // Redirect to home page after successful login
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setError('Failed to authenticate with Google');
          setStatus('error');
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err?.response?.data?.message || 'Authentication failed');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Google-ით ავტორიზაცია...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-4 text-green-600 font-semibold">წარმატებით შეხვედით!</p>
          <p className="mt-2 text-gray-600">მთავარ გვერდზე გადამისამართება...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="mt-4 text-red-600 font-semibold">ავტორიზაციის შეცდომა</p>
        <p className="mt-2 text-gray-600">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          მთავარ გვერდზე დაბრუნება
        </button>
      </div>
    </div>
  );
}
