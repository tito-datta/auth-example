import { handleAuth, handleCallback, handleLogin, handleLogout, handleProfile } from '@auth0/nextjs-auth0';

export const { GET, POST } = handleAuth({
  login: handleLogin({
    returnTo: '/weather'
  }),
  callback: handleCallback({
    redirectUri: process.env.AUTH0_REDIRECT_URI
  }),
  logout: handleLogout({
    returnTo: '/'
  }),
  profile: handleProfile()
});
