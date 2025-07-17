'use client'

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [googleUrl, setGoogleUrl] = useState<string>('');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testGoogleOAuth = async () => {
    addLog('🔧 Testing Google OAuth URL...');
    
    try {
      const response = await fetch('/api/auth/google', {
        method: 'GET',
        redirect: 'manual'
      });
      
      addLog(`📡 Response status: ${response.status}`);
      addLog(`📡 Response type: ${response.type}`);
      
      if (response.status === 302) {
        const location = response.headers.get('Location');
        if (location) {
          setGoogleUrl(location);
          addLog(`🔗 Redirect URL: ${location.substring(0, 100)}...`);
        }
      }
      
      const text = await response.text();
      addLog(`📄 Response body: ${text.substring(0, 200)}...`);
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    }
  };

  const testDirectRedirect = () => {
    addLog('🔄 Testing direct redirect...');
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    addLog(`🌐 Redirecting to: ${url}`);
    window.location.href = url;
  };

  const testManualOAuth = () => {
    if (googleUrl) {
      addLog('🎯 Opening Google OAuth URL manually...');
      window.location.href = googleUrl;
    } else {
      addLog('❌ No Google URL available. Run test first.');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testBackendHealth = async () => {
    addLog('🏥 Testing backend health...');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/debug`);
      const data = await response.json();
      addLog(`✅ Backend status: ${response.status}`);
      addLog(`📊 Backend response: ${JSON.stringify(data).substring(0, 200)}...`);
    } catch (error: any) {
      addLog(`❌ Backend error: ${error.message}`);
    }
  };

  useEffect(() => {
    addLog('🚀 Debug page loaded');
    addLog(`🔧 API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
    addLog(`🔑 Google Client ID: ${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.substring(0, 20)}...`);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Google OAuth Debug</h1>
        
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={testBackendHealth}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Backend Health
            </button>
            
            <button
              onClick={testGoogleOAuth}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test OAuth URL
            </button>
            
            <button
              onClick={testDirectRedirect}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Direct Redirect
            </button>
            
            <button
              onClick={testManualOAuth}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              disabled={!googleUrl}
            >
              Manual OAuth
            </button>
          </div>
          
          <div className="mt-4">
            <button
              onClick={clearLogs}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</div>
            <div><strong>Google Client ID:</strong> {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.substring(0, 30)}...</div>
            <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
            <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-scroll">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Google URL Display */}
        {googleUrl && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Generated Google OAuth URL</h2>
            <div className="bg-gray-100 p-4 rounded text-sm break-all">
              {googleUrl}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
