const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization?: string;
  position?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Google OAuth types removed

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    picture?: string;
    role: 'user' | 'admin';
    status: 'active' | 'blocked';
    isEmailVerified?: boolean;
  };
}

export const authApi = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🌐 API Login request:', { 
      email: data.email, 
      passwordLength: data.password?.length,
      apiUrl: `${API_BASE_URL}/auth/login`
    });
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('🌐 API Login response status:', response.status);
    console.log('🌐 API Login response headers:', response.headers);

    if (!response.ok) {
      const error = await response.json();
      console.error('🌐 API Login error response:', error);
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    console.log('🌐 API Login success:', { 
      hasUser: !!result?.user, 
      hasToken: !!result?.accessToken,
      userEmail: result?.user?.email 
    });

    if (result?.user && result.user.isEmailVerified === false) {
      throw new Error('გთხოვთ, დაადასტურეთ ელფოსტა ანგარიშის გასააქტიურებლად');
    }

    return result;
  },

  // googleAuth and googleCallback removed

  async getProfile(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get profile');
    }

    return response.json();
  },

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Email verification failed');
    }

    return response.json();
  },
};
