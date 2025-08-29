'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CredentialResponse, useGoogleLogin } from '@react-oauth/google'
import Image from 'next/image'
import api from '../lib/api'
import RegistrationModal from './RegistrationModal'

interface ApiError {
  response?: {
    status: number;
    data: {
      message: string;
      code?: string;
      userInfo?: any;
    };
  };
  message: string;
}

interface RegistrationFormData {
  personalNumber: string;
  phoneNumber: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            prompt_parent_id?: string;
            ux_mode?: string;
            scope?: string;
            locale?: string;
          }) => void;
          renderButton: (element: HTMLElement, options: {
            theme?: string;
            size?: string;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, login } = useAuthStore()
  const [showRegistration, setShowRegistration] = useState(false)
  const [pendingIdToken, setPendingIdToken] = useState<string | null>(null)
  const [pendingUserInfo, setPendingUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string>('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Use a safe initial for avatar fallback when no user.picture
  const profileInitial = (user?.name?.trim()?.charAt(0) || user?.email?.trim()?.charAt(0) || 'პ').toUpperCase()

  const handleSmoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
      });
    }
  };

  // No need to call loadFromStorage here - handled by AuthProvider

  const handleGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    try {
      console.log('Google Sign-In response:', credentialResponse);
      const idToken = credentialResponse.credential
      if (!idToken) {
        console.error('No ID token received from Google');
        alert('Google ავტორიზაციის შეცდომა: ტოკენი ვერ მოიძებნა')
        return
      }
      
      console.log('ID token received, length:', idToken.length);
      
      // Check if user already exists
      try {
        const res = await api.post('/auth/google', {
          idToken,
          // Don't send empty personalNumber and phoneNumber for initial check
        })
        console.log('Auth response:', res.data);
        login(res.data)
        router.push('/dashboard')
        router.refresh()
      } catch (err: unknown) {
        const error = err as ApiError
        console.error('Auth API error:', error);
        
        // Check if this is a registration required error
        if (error?.response?.status === 400 && 
            error?.response?.data?.code === 'REGISTRATION_REQUIRED') {
          // User doesn't exist, show registration form
          setPendingIdToken(idToken)
          setPendingUserInfo(error.response.data.userInfo)
          setShowRegistration(true)
          setAuthError('')
        } else {
          setAuthError('ავტორიზაციის შეცდომა: ' + (error?.response?.data?.message || error?.message || 'უცნობი შეცდომა'))
        }
      }
    } catch (err: unknown) {
      const error = err as ApiError
      console.error('Google Sign-In error:', error);
      setAuthError('ავტორიზაციის შეცდომა: ' + (error?.response?.data?.message || error?.message || 'უცნობი შეცდომა'))
    }
  }, [login, router])

  // Use the same working Google login logic as LoginPage
  const handleWorkingGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setAuthError('');
        
        console.log('🔧 Google login success, getting user info...');
        
        // Get user info from Google
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: 'application/json'
            }
          }
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          console.log('🔧 User info received:', userInfo);
          
          // Try to authenticate with backend using Google user info
          try {
            const res = await api.post('/auth/google', {
              // Send user info to backend for authentication
              googleId: userInfo.id,
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture
            });
            
            console.log('🔧 Backend auth response:', res.data);
            login(res.data);
            router.push('/dashboard');
            router.refresh();
          } catch (err: unknown) {
            const error = err as ApiError;
            console.error('� Backend auth error:', error);
            
            // Check if this is a registration required error
            if (error?.response?.status === 400 && 
                error?.response?.data?.code === 'REGISTRATION_REQUIRED') {
              // Show registration form with Google user info
              setPendingUserInfo(userInfo);
              setShowRegistration(true);
              setAuthError('');
            } else {
              setAuthError('ავტორიზაციის შეცდომა: ' + (error?.response?.data?.message || error?.message || 'უცნობი შეცდომა'));
            }
          }
        } else {
          console.error('🔧 Failed to get user info from Google');
          setAuthError('Google-დან მომხმარებლის ინფორმაციის მიღება ვერ მოხერხდა');
        }
      } catch (error) {
        console.error('🔧 Google login error:', error);
        setAuthError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('🔧 Google login error:', error);
      setAuthError('Google-ით შესვლისას დაფიქსირდა შეცდომა');
    }
  });

  const handleCustomGoogleSignIn = () => {
    // Use the working Google login implementation
    handleWorkingGoogleLogin();
  };

  useEffect(() => {
    // Initialize Google Sign-In
    console.log('🔧 Initializing Google Sign-In...');
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log('🔑 Google Client ID:', {
      clientId,
      isConfigured: clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE',
      envVars: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      }
    });
    
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      console.error('❌ Google Client ID not configured properly');
      console.error('💡 Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables');
      return;
    }
    
    // Initialize Google API for both development and production
    if (window.google && window.google.accounts) {
      console.log('✅ Google API loaded, initializing...');
      try {
        // Check if we're on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSuccess,
          auto_select: false,
          cancel_on_tap_outside: true,
          prompt_parent_id: 'google-signin-container',
          ux_mode: 'redirect', // Use redirect mode for consistent session handling
          scope: 'openid email profile',
          locale: 'ka', // Georgian locale
          // Mobile-specific optimizations
          ...(isMobile && {
            context: 'signin',
            itp_support: true,
          }),
        });
        
        console.log('✅ Google Sign-In initialized successfully');
      } catch (error) {
        console.error('❌ Google Sign-In initialization failed:', error);
      }
    } else {
      console.error('❌ Google API not loaded - script may not have loaded yet');
    }
  }, [handleGoogleSuccess, user]);

  const isActive = (path: string) => pathname === path

  const handleRegistrationSubmit = async (data: { personalNumber: string; phoneNumber: string }) => {
    if (!pendingIdToken) return

    setLoading(true)
    setAuthError('')
    try {
      const res = await api.post('/auth/google/complete-registration', {
        idToken: pendingIdToken,
        personalNumber: data.personalNumber,
        phoneNumber: data.phoneNumber,
      })
      login(res.data)
      setShowRegistration(false)
      setPendingIdToken(null)
      setPendingUserInfo(null)
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const error = err as ApiError
      setAuthError('რეგისტრაციის შეცდომა: ' + (error?.response?.data?.message || error?.message || 'უცნობი შეცდომა'))
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="inline-flex items-center" aria-label="Home">
                  <Image 
                    src="/logo-3.jpg" 
                    alt="App logo" 
                    width={120} 
                    height={36} 
                    priority
                    style={{ height: 36, width: 'auto' }}
                  />
                </Link>
              </div>
              {/* Desktop Menu */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {!user && (
                  <>
                    <Link
                      href="/"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive('/')
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      მთავარი
                    </Link>
                    <button
                      onClick={() => handleSmoothScroll('about')}
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      ჩვენი მიზანი
                    </button>
                    <button
                      onClick={() => handleSmoothScroll('demo')}
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      ფორმების ნიმუშები
                    </button>
                    <button
                      onClick={() => handleSmoothScroll('contact')}
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      კავშირი
                    </button>
                  </>
                )}
                {user && (
                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/dashboard')
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    სამუშაო სივრცე
                  </Link>
                )}
              </div>
            </div>
            
            {/* Desktop Right Side */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {!user && (
                <>
                  <Link
                    href="/auth/login"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    შესვლა
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-3 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                  >
                    რეგისტრაცია
                  </Link>
                  <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                    ჩვენი მიზანი
                  </Link>
                  <Link href="/terms" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                    წესები და პირობები
                  </Link>
                  <Link href="/privacy" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                    კონფიდენციალურობა
                  </Link>
                </>
              )}
              {user && (
                <>
                  <Link href="/profile" aria-label="პროფილი" className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-50">
                    {user.picture ? (
                      <Image 
                        src={user.picture} 
                        alt="profile" 
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {profileInitial}
                      </div>
                    )}
                    <span className="font-medium text-gray-700">{user.name || 'პროფილი'}</span>
                  </Link>
                  
                  {/* Admin Panel Link */}
                  {user.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                  >
                    გამოსვლა
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!mobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {!user && (
                <>                  <Link
                    href="/"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive('/')
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    მთავარი
                  </Link>
                  <button
                    onClick={() => {
                      handleSmoothScroll('about');
                      setMobileMenuOpen(false);
                    }}
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                  >
                    ჩვენი მიზანი
                  </button>
                  <button
                    onClick={() => {
                      handleSmoothScroll('demo');
                      setMobileMenuOpen(false);
                    }}
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                  >
                    ფორმების ნიმუშები
                  </button>
                  <button
                    onClick={() => {
                      handleSmoothScroll('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
                  >
                    კავშირი
                  </button>
                </>
              )}
              {user && (
                <Link
                  href="/dashboard"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-primary-50 border-primary-500 text-primary-700' 
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  სამუშაო სივრცე
                </Link>
              )}
            </div>
            
            {/* Mobile auth section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {!user && (
                <div className="space-y-3 px-3">
                  <Link
                    href="/auth/login"
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    შესვლა / რეგისტრაცია
                  </Link>
                  
                  {authError && (
                    <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                      {authError}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      router.push('/auth/login')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    შესვლა Google ანგარიშით
                  </button>
                </div>
              )}
              
              {user && (
                <div className="px-3 space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    {user.picture ? (
                      <Image 
                        src={user.picture} 
                        alt="profile" 
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {profileInitial}
                      </div>
                    )}
                    <div>
                      <div className="text-base font-medium text-gray-800">{user.name || 'პროფილი'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    პროფილი
                  </Link>
                  
                  {/* Admin Panel Link for mobile */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    გამოსვლა
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <RegistrationModal
        open={showRegistration}
        onClose={() => {
          setShowRegistration(false)
          setPendingIdToken(null)
          setPendingUserInfo(null)
          setAuthError('')
        }}
        onSubmit={handleRegistrationSubmit}
        userInfo={pendingUserInfo}
        loading={loading}
        error={authError}
      />
    </>
  )
}