import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export const GET = handleCallback({
  afterCallback: (_req, _res, session) => {
    return session;
  }
});
