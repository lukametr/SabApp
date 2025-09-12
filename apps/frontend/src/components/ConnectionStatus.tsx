'use client';

import { useEffect, useState } from 'react';
import { Chip } from '@mui/material';

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Check browser online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check API status (go through Next.js proxy so it works in all envs)
    const checkAPI = async () => {
      try {
        const response = await fetch(`/api/health`);
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };

    checkAPI();
    const interval = setInterval(checkAPI, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOnline) {
    return (
      <Chip
        label="ინტერნეტი არ არის"
        color="error"
        size="small"
        sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
      />
    );
  }

  if (apiStatus === 'offline') {
    return (
      <Chip
        label="სერვერი მიუწვდომელია"
        color="warning"
        size="small"
        sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
      />
    );
  }

  return null;
}
