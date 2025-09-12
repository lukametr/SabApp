'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// Google OAuth removed
import Image from 'next/image';
import api from '../lib/api';
import RegistrationModal from './RegistrationModal';

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

// No window.google declarations needed

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, login } = useAuthStore();
  const [showRegistration, setShowRegistration] = useState(false);
  // Google registration flow removed
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use a safe initial for avatar fallback when no user.picture
  const profileInitial = (
    user?.name?.trim()?.charAt(0) ||
    user?.email?.trim()?.charAt(0) ||
    'პ'
  ).toUpperCase();

  const handleSmoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // No need to call loadFromStorage here - handled by AuthProvider

  // Google login removed

  const isActive = (path: string) => pathname === path;

  // Registration via Google removed

  const handleLogout = () => {
    logout();
    router.push('/');
    router.refresh();
  };

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
                    <Link
                      href="/about"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      ჩვენს შესახებ
                    </Link>
                    <Link
                      href="/privacy"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      კონფიდენციალურობა
                    </Link>
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
                </>
              )}
              {user && (
                <>
                  <Link
                    href="/profile"
                    aria-label="პროფილი"
                    className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-50"
                  >
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
                    <span className="text-sm text-gray-700">{user.name || 'პროფილი'}</span>
                  </Link>

                  {/* Admin Panel Link for desktop */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
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
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
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
                <>
                  {' '}
                  <Link
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
                  <Link
                    href="/about"
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ჩვენს შესახებ
                  </Link>
                  <Link
                    href="/privacy"
                    className="border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    კონფიდენციალურობა
                  </Link>
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
                      <div className="text-base font-medium text-gray-800">
                        {user.name || 'პროფილი'}
                      </div>
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
                      handleLogout();
                      setMobileMenuOpen(false);
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
          setShowRegistration(false);
          setAuthError('');
        }}
        onSubmit={async () => { setShowRegistration(false); }}
        loading={loading}
        error={authError}
      />
    </>
  );
}
