'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google'
import api from '../lib/api'
import RegistrationForm from './RegistrationForm'

interface ApiError {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
  message: string;
}

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, login, loadFromStorage } = useAuthStore()
  const [showRegistration, setShowRegistration] = useState(false)
  const [pendingIdToken, setPendingIdToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const isActive = (path: string) => pathname === path

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse.credential
      if (!idToken) {
        alert('Google ავტორიზაციის შეცდომა: ტოკენი ვერ მოიძებნა')
        return
      }
      
      // Check if user already exists
      try {
        const res = await api.post('/auth/google', {
          idToken,
          personalNumber: '',
          phoneNumber: '',
        })
        login(res.data)
        router.refresh()
      } catch (err: unknown) {
        const error = err as ApiError
        if (error?.response?.status === 409 && error?.response?.data?.message?.includes('Personal number')) {
          // User doesn't exist, show registration form
          setPendingIdToken(idToken)
          setShowRegistration(true)
        } else {
          alert('ავტორიზაციის შეცდომა: ' + (error?.response?.data?.message || error?.message || 'უცნობი შეცდომა'))
        }
      }
    } catch (err: unknown) {
      const error = err as ApiError
      alert('ავტორიზაციის შეცდომა: ' + (error?.response?.data?.message || error?.message || 'უცნობი შეცდომა'))
    }
  }

  const handleRegistrationSubmit = async (personalNumber: string, phoneNumber: string) => {
    if (!pendingIdToken) return

    setLoading(true)
    try {
      const res = await api.post('/auth/google', {
        idToken: pendingIdToken,
        personalNumber,
        phoneNumber,
      })
      login(res.data)
      setShowRegistration(false)
      setPendingIdToken(null)
      router.refresh()
    } catch (err: unknown) {
      const error = err as ApiError
      alert('რეგისტრაციის შეცდომა: ' + (error?.response?.data?.message || error?.message || 'უცნობი შეცდომა'))
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
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => alert('Google ავტორიზაციის შეცდომა')}
                  useOneTap
                  text="signin_with"
                  shape="pill"
                  width="180"
                  locale="ka"
                />
              )}
              {user && (
                <>
                  <Link href="/profile" className="flex items-center space-x-2">
                    {user.picture && (
                      <img src={user.picture} alt="profile" className="w-8 h-8 rounded-full" />
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

      <RegistrationForm
        open={showRegistration}
        onClose={() => {
          setShowRegistration(false)
          setPendingIdToken(null)
        }}
        onSubmit={handleRegistrationSubmit}
        loading={loading}
      />
    </>
  )
} 