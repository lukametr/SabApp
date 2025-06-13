'use client';

import { useState } from 'react';
import { DocumentForm } from '@/components/DocumentForm';
import { DocumentList } from '@/components/DocumentList';
import { useAuth } from '@/contexts/AuthContext';

export default function DocumentsPage() {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">ავტორიზაცია საჭიროა</h2>
        <p className="text-gray-600">
          დოკუმენტების სანახავად და მართვისთვის გთხოვთ გაიაროთ ავტორიზაცია.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">დოკუმენტები</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'დახურვა' : 'ახალი დოკუმენტი'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <DocumentForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <DocumentList />
    </div>
  );
} 