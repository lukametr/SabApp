'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LandingPage from '../components/LandingPage';
import { authService } from '../services/auth.service';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for Google OAuth success parameters
    const auth = searchParams.get('auth');
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (auth === 'success' && token && userParam) {
      try {
        // Store authentication data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', decodeURIComponent(userParam));
        
        // Clean URL and redirect to dashboard
        router.replace('/dashboard');
      } catch (err) {
        console.error('Failed to process authentication:', err);
        router.replace('/?error=Authentication processing failed');
      }
    } else if (error) {
      // Show error message
      console.error('Authentication error:', error);
      // The error will be displayed by LandingPage component
    }
  }, [searchParams, router]);

  return <LandingPage />;
}