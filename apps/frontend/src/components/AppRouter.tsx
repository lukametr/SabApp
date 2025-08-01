'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  organization?: string;
  position?: string;
}

export default function AppRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Check for stored user data only after hydration
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [mounted]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    router.push('/');
  };

  // Show loading until mounted to prevent hydration mismatch
  if (!mounted || loading) {
    return <div>Loading...</div>; // TODO: Add proper loading component
  }

  // Route handling
  if (pathname === '/auth/login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (pathname === '/auth/register') {
    return <RegisterPage onRegister={handleRegister} />;
  }

  if (pathname === '/dashboard') {
    if (!user) {
      router.push('/auth/login');
      return <div>Redirecting...</div>;
    }
    return <Dashboard user={user} />;
  }

  // Default route - Landing page
  if (user && pathname === '/') {
    // If user is logged in and on landing page, redirect to dashboard
    router.push('/dashboard');
    return <div>Redirecting...</div>;
  }

  return <LandingPage />;
}
