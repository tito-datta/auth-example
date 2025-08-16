'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { apiService, UserInfo, ApiError } from '../../lib/api';
import Link from 'next/link';

export default function UserPage() {
  const { user, error: authError, isLoading } = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get access token
      const response = await fetch('/api/auth/token');
      if (!response.ok) {
        throw new Error('Failed to get access token');
      }
      
      const { accessToken } = await response.json();
      const info = await apiService.getUserInfo(accessToken);
      setUserInfo(info);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(`API Error: ${e.message}`);
      } else {
        setError('Failed to fetch user info');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  if (isLoading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse">Loading...</div>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div className="text-red-600">Authentication Error: {authError.message}</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">User Information</h1>
        <p className="mb-4">You must be logged in to view this page.</p>
        <Link 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          href="/api/auth/login"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Information</h1>
        <div className="space-x-4">
          <Link className="text-blue-600 hover:underline" href="/">Home</Link>
          <Link className="text-blue-600 hover:underline" href="/weather">Weather</Link>
          <Link className="text-red-600 hover:underline" href="/api/auth/logout">Logout</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Frontend User Info (from Auth0 SDK) */}
        <div className="bg-white p-6 rounded border shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Frontend User Info</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Picture:</strong></p>
            {user.picture && (
              <img 
                src={user.picture} 
                alt="Profile" 
                className="w-16 h-16 rounded-full"
              />
            )}
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Raw User Object</summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Backend User Info (from API) */}
        <div className="bg-white p-6 rounded border shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-700">Backend User Info</h2>
            <button 
              onClick={fetchUserInfo}
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {userInfo && (
            <div className="space-y-4">
              <p><strong>Authenticated:</strong> {userInfo.isAuthenticated ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Name:</strong> {userInfo.name || 'Not available'}</p>
              
              <div>
                <h3 className="font-semibold mb-2">JWT Claims:</h3>
                <div className="max-h-64 overflow-auto">
                  {userInfo.claims.map((claim, index) => (
                    <div key={index} className="text-sm border-b py-1">
                      <strong>{claim.type}:</strong> {claim.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Health Check */}
      <div className="bg-gray-50 p-6 rounded border">
        <h2 className="text-xl font-semibold mb-4">API Health Check</h2>
        <button 
          onClick={async () => {
            try {
              const health = await apiService.getHealthCheck();
              alert(`API Status: ${health.status}\nTimestamp: ${health.timestamp}`);
            } catch (e) {
              alert(`API Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Test API Connection
        </button>
      </div>
    </main>
  );
}
