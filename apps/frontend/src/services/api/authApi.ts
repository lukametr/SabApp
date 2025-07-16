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

export interface GoogleAuthData {
  code?: string;
  accessToken?: string;
}

export interface GoogleCallbackData {
  code: string;
  state: string;
}

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

  async googleAuth(data: GoogleAuthData): Promise<AuthResponse> {
    let body: any = {};
    if (data.code) {
      body.code = data.code;
    }
    if (data.accessToken) {
      body.accessToken = data.accessToken;
    }
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Google authentication failed');
    }

    return response.json();
  },

  async googleCallback(data: GoogleCallbackData): Promise<AuthResponse> {
    console.log('🌐 [authApi] Google Callback API გამოძახება:', {
      apiUrl: `${API_BASE_URL}/auth/google/callback`,
      data
    });
    const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('🌐 [authApi] Google Callback API პასუხის სტატუსი:', response.status);
    let responseBody;
    try {
      responseBody = await response.clone().json();
      console.log('🌐 [authApi] Google Callback API პასუხი:', responseBody);
    } catch (e) {
      responseBody = null;
      console.error('🌐 [authApi] Google Callback API პასუხის წაკითხვის შეცდომა:', e);
    }

    if (!response.ok) {
      console.error('🌐 [authApi] Google Callback API შეცდომა:', responseBody);
      throw new Error((responseBody && responseBody.message) || 'Google callback failed');
    }

    return responseBody;
  },

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
};
