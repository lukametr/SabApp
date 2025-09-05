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
    phoneNumber: '' as string,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

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
      phoneNumber: user.phoneNumber || '',
    });
    setEditing(true);
  };

  const save = async () => {
    try {
      setSaving(true);
      setError('');
      
      // მონაცემების მომზადება
      const payload = {
        name: form.name,
        organization: form.organization,
        position: form.position,
        phoneNumber: form.phoneNumber
      };
      
      // API call
      const response = await authApi.updateProfile(payload);
      
      // გადმოღებული მონაცემების შენახვა
      const updatedUser = response.data;
      
      // Store-ში განახლება
      setUser(updatedUser);
      
      // localStorage-ში განახლება
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // რედაქტირების დახურვა
      setEditing(false);
      
    } catch (err: any) {
      console.error('Save error:', err);
      const status = err?.response?.status;
      const msg: string | undefined = err?.response?.data?.message;
      if (status === 409) {
        if (msg && typeof msg === 'string' && msg.toLowerCase().includes('phonenumber')) {
          setError('ეს ტელეფონის ნომერი უკვე გამოიყენება სხვა ანგარიშზე.');
        } else {
          setError(msg || 'კონფლიქტი: ერთი ან რამდენიმე ველი უკვე გამოიყენება.');
        }
      } else if (status === 400) {
        setError(msg || 'არასწორი მონაცემები. გთხოვთ გადაამოწმოთ ველები.');
      } else {
        setError('შენახვა ვერ მოხერხდა');
      }
    } finally {
      setSaving(false);
    }
  };

  // Password change handler
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('ახალი პაროლები არ ემთხვევა');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token || localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordError('');
        alert('პაროლი წარმატებით შეიცვალა');
      } else {
        const error = await response.json();
        setPasswordError(error.message || 'პაროლის შეცვლა ვერ მოხერხდა');
      }
    } catch (error) {
      setPasswordError('სერვერთან კავშირის შეცდომა');
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
          {user.phoneNumber && (
            <div className="mb-2">ტელეფონი: <span className="font-mono">{user.phoneNumber}</span></div>
          )}
          {user.organization && (
            <div className="mb-2">ორგანიზაცია: <span className="font-mono">{user.organization}</span></div>
          )}
          {user.position && (
            <div className="mb-2">პოზიცია: <span className="font-mono">{user.position}</span></div>
          )}
          <div className="mb-2">სტატუსი: <span className="font-mono">{user.status}</span></div>
          <div className="mb-2">როლი: <span className="font-mono">{user.role}</span></div>
          <div className="mb-2">ელფოსტის დადასტურება: <span className="font-mono">{user.isEmailVerified ? 'დადასტურებულია' : 'ვერ დადასტურდა'}</span></div>
          <div className="mt-4 flex gap-2">
            <button onClick={startEdit} className="px-4 py-2 bg-blue-600 text-white rounded">რედაქტირება</button>
            <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 bg-orange-600 text-white rounded">პაროლის შეცვლა</button>
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
            <label className="block text-sm text-gray-700 mb-1">ტელეფონი</label>
            <input value={form.phoneNumber} onChange={e=>setForm({...form, phoneNumber: e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-2 pt-2">
            <button disabled={saving} onClick={save} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50">შენახვა</button>
            <button disabled={saving} onClick={()=>setEditing(false)} className="px-4 py-2 bg-gray-200 rounded">გაუქმება</button>
          </div>
        </div>
      )}
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">პაროლის შეცვლა</h2>
            {passwordError && <div className="text-red-600 mb-3">{passwordError}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">მიმდინარე პაროლი</label>
                <input 
                  type="password"
                  value={passwordData.currentPassword} 
                  onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">ახალი პაროლი</label>
                <input 
                  type="password"
                  value={passwordData.newPassword} 
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">ახალი პაროლის დადასტურება</label>
                <input 
                  type="password"
                  value={passwordData.confirmPassword} 
                  onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handlePasswordChange} className="px-4 py-2 bg-green-600 text-white rounded">შეცვლა</button>
                <button onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }} className="px-4 py-2 bg-gray-200 rounded">გაუქმება</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 