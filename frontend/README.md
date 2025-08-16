# Frontend Weather App

## Setup

1. Install pnpm if not installed: `npm i -g pnpm`
2. Copy `.env.example` to `.env.local` and fill values.
3. Install deps: `pnpm install`
4. Run dev server: `pnpm dev`
5. Run storybook: `pnpm storybook`
6. Run tests: `pnpm test`

## Environment Variables

```
AUTH0_SECRET=CHANGE_ME
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_TENANT.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
NEXT_PUBLIC_OPENWEATHER_KEY=YOUR_KEY
```
