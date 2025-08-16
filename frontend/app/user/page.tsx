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
      <main className="p-8 max-w-4xl mx-auto bg-white dark:bg-dark-bg min-h-screen">
        <div className="animate-pulse text-blue-600 dark:text-blue-300">Loading...</div>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="p-8 max-w-4xl mx-auto bg-white dark:bg-dark-bg min-h-screen">
        <div className="text-red-600">Authentication Error: {authError.message}</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-8 max-w-4xl mx-auto text-center bg-white dark:bg-dark-bg min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-dark-text">User Information</h1>
        <p className="mb-4 text-gray-700 dark:text-dark-text-secondary">You must be logged in to view this page.</p>
        <Link 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          href="/api/auth/login?prompt=login"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8 bg-white dark:bg-dark-bg min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">User Information</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Frontend User Info (from Auth0 SDK) */}
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded border border-gray-200 dark:border-dark-border shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">Frontend User Info</h2>
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-dark-text"><strong>Name:</strong> {user.name}</p>
            <p className="text-gray-900 dark:text-dark-text"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-900 dark:text-dark-text"><strong>Picture:</strong></p>
            {user.picture && (
              <img 
                src={user.picture} 
                alt="Profile" 
                className="w-16 h-16 rounded-full"
              />
            )}
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Raw User Object</summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-dark-bg rounded text-xs overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Backend User Info (from API) */}
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded border border-gray-200 dark:border-dark-border shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-300">Backend User Info</h2>
            <button 
              onClick={fetchUserInfo}
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-300 dark:border-dark-border text-red-700 dark:text-red-300 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {userInfo && (
            <div className="space-y-4">
              <p className="text-gray-900 dark:text-dark-text"><strong>Authenticated:</strong> {userInfo.isAuthenticated ? '✅ Yes' : '❌ No'}</p>
              <p className="text-gray-900 dark:text-dark-text"><strong>Name:</strong> {userInfo.name || 'Not available'}</p>
              
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-dark-text">JWT Claims:</h3>
                <div className="max-h-64 overflow-auto">
                  {userInfo.claims.map((claim, index) => (
                    <div key={index} className="text-sm border-b border-gray-200 dark:border-dark-border py-1 text-gray-900 dark:text-dark-text">
                      <strong>{claim.type}:</strong> {claim.value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
