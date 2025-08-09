import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.json(session.user);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return new NextResponse(null, { status: 500 });
  }
}
