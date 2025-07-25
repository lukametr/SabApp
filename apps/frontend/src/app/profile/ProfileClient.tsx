'use client';

import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfileClient() {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  // No need to call loadFromStorage here - handled by AuthProvider

  useEffect(() => {
    // Only redirect if not loading and no user
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // or loading spinner
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">პროფილი</h1>
      <div className="flex items-center space-x-4 mb-4">
        {user.picture && (
          <Image 
            src={user.picture} 
            alt="profile" 
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <div className="font-semibold text-lg">{user.name}</div>
          <div className="text-gray-600">{user.email}</div>
        </div>
      </div>
      <div className="mb-2">პირადი ნომერი: <span className="font-mono">{user.personalNumber}</span></div>
      <div className="mb-2">ტელეფონი: <span className="font-mono">{user.phoneNumber}</span></div>
      <div className="mb-2">სტატუსი: <span className="font-mono">{user.status}</span></div>
      <div className="mb-2">როლი: <span className="font-mono">{user.role}</span></div>
      <div className="mb-2">ელფოსტის დადასტურება: <span className="font-mono">{user.isEmailVerified ? 'დადასტურებულია' : 'ვერ დადასტურდა'}</span></div>
      <div className="mb-2">ბოლო შესვლა: <span className="font-mono">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('ka-GE') : '-'}</span></div>
    </div>
  );
} 