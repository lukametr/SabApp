'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LandingPage from '../components/LandingPage';
import { useAuthStore } from '../store/authStore';
import { CircularProgress, Box } from '@mui/material';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, token, user, loadFromStorage, loading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      console.log('🏠 Home: Starting auth check...');
      
      // First, load from storage
      loadFromStorage();
      
      // Give time for auth to initialize
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check for Google OAuth success parameters
      const auth = searchParams?.get('auth');
      const tokenParam = searchParams?.get('token');
      const userParam = searchParams?.get('user');
      const error = searchParams?.get('error');
      const stayOnHome = searchParams?.get('stay'); // New parameter to stay on home page

      if (auth === 'success' && tokenParam && userParam) {
        try {
          console.log('🏠 Processing OAuth success parameters');
          // Store authentication data
          localStorage.setItem('token', tokenParam);
          localStorage.setItem('user', decodeURIComponent(userParam));
          
          // Load the new auth state
          loadFromStorage();
          
          // Clean URL and redirect to dashboard
          router.replace('/dashboard');
          return;
        } catch (err) {
          console.error('Failed to process authentication:', err);
          router.replace('/?error=Authentication processing failed');
          return;
        }
      } else if (error) {
        console.error('Authentication error:', error);
        setIsChecking(false);
        return;
      }

      // If user explicitly wants to stay on home page, don't redirect
      if (stayOnHome === 'true') {
        console.log('🏠 User requested to stay on home page');
        setIsChecking(false);
        return;
      }

      // Check if user is already authenticated
      const currentState = useAuthStore.getState();
      console.log('🏠 Current auth state:', {
        isAuthenticated: currentState.isAuthenticated,
        hasToken: !!currentState.token,
        hasUser: !!currentState.user,
      });
      
      if (currentState.isAuthenticated() && currentState.token && currentState.user) {
        try {
          // Validate token
          const payload = JSON.parse(atob(currentState.token.split('.')[1]));
          const exp = payload.exp * 1000;
          
          if (Date.now() < exp) {
            console.log('🏠 User is authenticated, redirecting to dashboard');
            router.push('/dashboard');
            return;
          } else {
            console.log('🏠 Token expired, staying on home page');
            useAuthStore.getState().logout();
          }
        } catch (error) {
          console.error('🏠 Error validating token:', error);
          useAuthStore.getState().logout();
        }
      }
      
      console.log('🏠 User is not authenticated, showing home page');
      setIsChecking(false);
    };

    checkAuthAndRedirect();
  }, [searchParams, router, loadFromStorage]);

  // Show loading while checking auth
  if (isChecking || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <LandingPage />;
}