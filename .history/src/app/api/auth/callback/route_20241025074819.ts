import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { access_token } = response.data;

    const redirectUrl = new URL('/dashboard', request.url);
    const res = NextResponse.redirect(redirectUrl);

    // Set the access token in a secure HTTP-only cookie
    res.cookies.set('github_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Error during GitHub OAuth:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
