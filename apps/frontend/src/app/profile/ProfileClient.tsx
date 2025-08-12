'use client';

import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authApi } from '../../lib/api';

export default function ProfileClient() {
  const { user, loading, setUser } = useAuthStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    organization: '',
    position: '',
    picture: '' as string,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const startEdit = () => {
    setForm({
      name: user.name || '',
      organization: user.organization || '',
      position: user.position || '',
      picture: user.picture || '',
    });
    setEditing(true);
  };

  const save = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload: any = {};
      if (form.name !== user.name) payload.name = form.name;
      if ((form.organization || null) !== (user.organization || null)) payload.organization = form.organization || null;
      if ((form.position || null) !== (user.position || null)) payload.position = form.position || null;
      if ((form.picture || null) !== (user.picture || null)) payload.picture = form.picture || null;

      await authApi.updateProfile(payload);
      setUser({ ...user, ...payload });
      setEditing(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'ვერ დავაკოპირე ცვლილებები');
    } finally {
      setSaving(false);
    }
  };

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
      {!editing ? (
        <>
          {user.organization && (
            <div className="mb-2">ორგანიზაცია: <span className="font-mono">{user.organization}</span></div>
          )}
          {user.position && (
            <div className="mb-2">პოზიცია: <span className="font-mono">{user.position}</span></div>
          )}
          <div className="mb-2">სტატუსი: <span className="font-mono">{user.status}</span></div>
          <div className="mb-2">როლი: <span className="font-mono">{user.role}</span></div>
          <div className="mb-2">ელფოსტის დადასტურება: <span className="font-mono">{user.isEmailVerified ? 'დადასტურებულია' : 'ვერ დადასტურდა'}</span></div>
          <div className="mt-4">
            <button onClick={startEdit} className="px-4 py-2 bg-blue-600 text-white rounded">რედაქტირება</button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {error && <div className="text-red-600">{error}</div>}
          <div>
            <label className="block text-sm text-gray-700 mb-1">სახელი და გვარი</label>
            <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">ორგანიზაცია</label>
            <input value={form.organization} onChange={e=>setForm({...form, organization: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">პოზიცია</label>
            <input value={form.position} onChange={e=>setForm({...form, position: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">ფოტოს URL</label>
            <input value={form.picture} onChange={e=>setForm({...form, picture: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-2 pt-2">
            <button disabled={saving} onClick={save} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50">შენახვა</button>
            <button disabled={saving} onClick={()=>setEditing(false)} className="px-4 py-2 bg-gray-200 rounded">გაუქმება</button>
          </div>
        </div>
      )}
    </div>
  );
} 