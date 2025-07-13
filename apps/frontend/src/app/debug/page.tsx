'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function DebugPage() {
  const { user, token, loadFromStorage } = useAuthStore();
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    loadFromStorage();
    
    // Get localStorage data directly
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      setLocalStorageData({
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken
      });
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const reLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@saba.com',
          password: 'admin123'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data);
        
        // Update auth store
        const { login } = useAuthStore.getState();
        login(data);
        
        window.location.reload();
      } else {
        console.error('Login failed:', response.status);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Admin Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Auth Store Data:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify({ user, token: token ? 'exists' : 'null' }, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>localStorage Data:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(localStorageData, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Role Check:</h2>
        <p>User exists: {user ? 'Yes' : 'No'}</p>
        <p>User role: {user?.role || 'undefined'}</p>
        <p>Is admin: {user?.role === 'admin' ? 'Yes' : 'No'}</p>
        <p>Role type: {typeof user?.role}</p>
      </div>

      <div>
        <button 
          onClick={clearStorage}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Storage & Reload
        </button>
        
        <button 
          onClick={reLogin}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Re-login as Admin
        </button>
      </div>
    </div>
  );
}
