// Navigation links moved to header
export default function HomePage() {
  return (
    <main className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Weather App</h1>
        <p className="text-lg text-gray-600">
          Secure weather application with Auth0 authentication and JWT-protected APIs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">🔐 Authentication</h2>
          <div className="space-y-3">
            <a 
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              href="/api/auth/login"
            >
              Login with Auth0
            </a>
            <a 
              className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              href="/user"
            >
              View User Info
            </a>
          </div>
        </div>

        {/* Weather Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 text-green-700">🌤️ Weather Data</h2>
          <div className="space-y-3">
            <a 
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors"
              href="/weather"
            >
              Weather Dashboard
            </a>
            <p className="text-sm text-gray-600">
              Protected route - requires authentication
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">✨ Features</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• 🔒 Auth0 authentication with JWT tokens</li>
          <li>• 🌡️ Today's weather from secured backend API</li>
          <li>• 📅 5-day weather forecast</li>
          <li>• 👤 User profile and claims inspection</li>
          <li>• 🚀 Next.js 14 with App Router</li>
          <li>• 🎨 Tailwind CSS styling</li>
        </ul>
      </div>

      {/* API Endpoints */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">🔗 API Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-green-700">Protected (requires JWT):</h3>
            <ul className="mt-2 space-y-1">
              <li>• <code>/weather</code> - Today's weather</li>
              <li>• <code>/weatherforecast</code> - 5-day forecast</li>
              <li>• <code>/user</code> - User claims</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700">Public:</h3>
            <ul className="mt-2 space-y-1">
              <li>• <code>/health</code> - API health check</li>
              <li>• <code>/auth/instructions</code> - Auth help</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
