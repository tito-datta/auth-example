/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org'
      },
      {
        protocol: 'https',
        hostname: '*.auth0.com'
      }
    ]
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { 
          key: 'Content-Security-Policy', 
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.auth0.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https: blob:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://*.auth0.com https://api.openweathermap.org http://localhost:5223 https://localhost:5001",
            "frame-src 'self' https://*.auth0.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self' https://*.auth0.com"
          ].join('; ')
        }
      ]
    }
  ]
};

module.exports = nextConfig;
