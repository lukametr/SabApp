'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentList } from '@/components/DocumentList';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">გთხოვთ შეხვიდეთ სისტემაში</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">პროფილი</h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">სახელი</h2>
              <p className="mt-1 text-sm text-gray-500">{user.name}</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">ელ-ფოსტა</h2>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ჩემი დოკუმენტები</h2>
          <DocumentList showMyDocuments={true} />
        </div>
      </div>
    </div>
  );
} 