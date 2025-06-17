'use client'

import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'

export const dynamic = 'force-dynamic'

export default function ServicesPage() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">ჩვენი სერვისები</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">სერვისი 1</h3>
                <p className="mt-2 text-sm text-gray-500">
                  სერვისის აღწერა აქ იქნება.
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">სერვისი 2</h3>
                <p className="mt-2 text-sm text-gray-500">
                  სერვისის აღწერა აქ იქნება.
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">სერვისი 3</h3>
                <p className="mt-2 text-sm text-gray-500">
                  სერვისის აღწერა აქ იქნება.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 