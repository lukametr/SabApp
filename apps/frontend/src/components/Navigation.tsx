'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { CredentialResponse } from '@react-oauth/google'
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
  const { user, logout, login, loadFromStorage } = useAuthStore()
  const [showRegistration, setShowRegistration] = useState(false)
  const [pendingIdToken, setPendingIdToken] = useState<string | null>(null)
  const [pendingUserInfo, setPendingUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string>('')

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

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

  const handleCustomGoogleSignIn = async () => {
    try {
      if (window.google && window.google.accounts) {
        // Show Google One Tap and sign-in popup
        try {
          window.google.accounts.id.prompt();
          
          // If prompt() doesn't throw error but token retrieval fails,
          // user will see "Error retrieving a token" in console.
          // We can add a timeout to detect this and offer alternative
          setTimeout(() => {
            console.log('💡 If you see "Error retrieving a token", try the alternative method below');
          }, 2000);
          
        } catch (promptError) {
          console.error('Google prompt failed:', promptError);
          console.log('🔄 Switching to redirect method due to prompt failure');
          handleGoogleRedirectSignIn();
        }
      } else {
        // If Google API is not loaded, use redirect method
        console.log('Google API not loaded, using redirect method');
        handleGoogleRedirectSignIn();
      }
    } catch (error) {
      console.error('Google Sign-In popup failed:', error);
      // Fallback to redirect method
      console.log('🔄 Switching to redirect method due to error');
      handleGoogleRedirectSignIn();
    }
  }

  const handleGoogleRedirectSignIn = () => {
    // Alternative method: use popup with manual rendering
    if (window.google && window.google.accounts) {
      console.log('Using alternative popup method instead of redirect');
      
      // Create a temporary container for Google button
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);
      
      try {
        // Render Google sign-in button programmatically
        window.google.accounts.id.renderButton(tempContainer, {
          theme: 'outline',
          size: 'large'
        });
        
        // Trigger click on the rendered button
        setTimeout(() => {
          const googleButton = tempContainer.querySelector('div[role="button"]') as HTMLElement;
          if (googleButton) {
            googleButton.click();
          }
          // Clean up
          document.body.removeChild(tempContainer);
        }, 100);
        
      } catch (error) {
        console.error('Alternative popup method failed:', error);
        document.body.removeChild(tempContainer);
        setAuthError('Google ავტორიზაცია ვერ მოხერხდა. გთხოვთ სცადოთ მოგვიანებით.');
      }
    } else {
      setAuthError('Google API არ არის ჩატვირთული. გთხოვთ განაახლოთ გვერდი.');
    }
  }

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
    
    if (window.google && window.google.accounts) {
      console.log('✅ Google API loaded, initializing...');
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSuccess,
          auto_select: false,
          cancel_on_tap_outside: true,
          prompt_parent_id: 'google-signin-container',
          ux_mode: 'popup',
          scope: 'openid email profile',
          locale: 'ka', // Georgian locale
        });
        
        // Don't show automatic prompt - let user click button instead
        // This avoids FedCM blocking issues
        console.log('✅ Google Sign-In initialized successfully');
      } catch (error) {
        console.error('❌ Google Sign-In initialization failed:', error);
        // Fallback: user will need to use manual button or redirect method
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
                <Link href="/" className="text-xl font-bold text-primary-600">
                  SabaP
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
                <Link
                  href="/documents"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/documents')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  დოკუმენტები
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user && (
                <div id="google-signin-container">
                  {authError && (
                    <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                      {authError}
                    </div>
                  )}
                  {/* Primary Google Sign-In button */}
                  <button
                    onClick={handleCustomGoogleSignIn}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    შესვლა Google ანგარიშით
                  </button>
                  
                  {/* Alternative method if popup fails */}
                  <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">
                      თუ Google Sign-In არ მუშაობს, {' '}
                      <button
                        onClick={handleGoogleRedirectSignIn}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        სცადეთ ალტერნატიული მეთოდი
                      </button>
                    </span>
                  </div>
                </div>
              )}
              {user && (
                <>
                  <Link href="/profile" className="flex items-center space-x-2">
                    {user.picture && (
                      <Image 
                        src={user.picture} 
                        alt="profile" 
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    გამოსვლა
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
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