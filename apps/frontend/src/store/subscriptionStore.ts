import { create } from 'zustand';
import { SubscriptionInfo } from '../types/user';

interface SubscriptionState {
  subscriptionInfo: SubscriptionInfo | null;
  loading: boolean;
  error: string | null;
  setSubscriptionInfo: (info: SubscriptionInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkSubscription: (token: string) => Promise<void>;
  clearSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptionInfo: null,
  loading: false,
  error: null,
  
  setSubscriptionInfo: (info) => set({ subscriptionInfo: info }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  checkSubscription: async (token: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/subscription/my-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        set({ 
          subscriptionInfo: data.subscription,
          loading: false 
        });
      } else if (response.status === 402) {
        // Payment required - subscription expired
        const errorData = await response.json();
        set({ 
          error: errorData.details || 'Subscription expired',
          loading: false 
        });
      } else {
        throw new Error('Failed to check subscription');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      set({ 
        error: 'Failed to check subscription status',
        loading: false 
      });
    }
  },
  
  clearSubscription: () => set({ 
    subscriptionInfo: null, 
    loading: false, 
    error: null 
  }),
}));
