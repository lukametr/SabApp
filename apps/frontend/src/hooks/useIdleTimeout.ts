import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

interface UseIdleTimeoutProps {
  timeoutDuration?: number; // milliseconds
  onTimeout?: () => void;
}

export function useIdleTimeout({ 
  timeoutDuration = 24 * 60 * 60 * 1000, // 24 hours default
  onTimeout 
}: UseIdleTimeoutProps = {}) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isAuthenticated()) {
      timeoutRef.current = setTimeout(() => {
        console.log('🕐 User idle timeout reached - logging out');
        
        // Clear cache and logout
        localStorage.clear();
        sessionStorage.clear();
        
        // Call custom timeout handler if provided
        if (onTimeout) {
          onTimeout();
        } else {
          logout();
          router.push('/');
        }
        
        // Force page reload to clear any remaining state
        window.location.reload();
      }, timeoutDuration);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Events that reset the timeout
    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Reset timeout initially
    resetTimeout();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    return () => {
      // Cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [isAuthenticated(), timeoutDuration]);

  return { resetTimeout };
}
