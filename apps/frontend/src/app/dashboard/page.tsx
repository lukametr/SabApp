'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import Dashboard from '../../components/Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []); // Only on mount

  useEffect(() => {
    // Only redirect if not loading and no user
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading while checking auth state
  if (loading) {
    return <div>Loading...</div>; // or loading spinner
  }

  // Show nothing if no user (will redirect)
  if (!user) {
    return null;
  }

  return <Dashboard />;
}
