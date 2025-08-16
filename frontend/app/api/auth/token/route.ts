import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const res = new NextResponse();
    
    // Get access token with proper audience for API access
    const { accessToken } = await getAccessToken(request, res, {
      scopes: ['openid', 'profile', 'email']
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token available. Make sure AUTH0_AUDIENCE is configured properly.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Error getting access token:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to get access token',
        details: errorMessage,
        hint: 'Check that AUTH0_AUDIENCE is properly configured in .env.development'
      },
      { status: 500 }
    );
  }
}
