/** @type {import('next').NextConfig} */
const nextConfig = {
  server: {
    https: {
      key: './certificates/localhost-key.pem',  // Update with your certificate paths
      cert: './certificates/localhost.pem',
    },
    port: 3000,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
    ]
  },
}
