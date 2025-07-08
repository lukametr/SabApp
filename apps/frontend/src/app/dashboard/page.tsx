'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import Dashboard from '../../components/Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    // Simple auth check - redirect to login if no user
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Show loading or dashboard based on auth state
  if (!user) {
    return null; // or loading spinner
  }

  return <Dashboard />;
}
