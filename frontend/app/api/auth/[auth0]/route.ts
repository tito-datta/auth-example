import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      // Force Auth0 to show the login page instead of silently reusing the SSO session
      // Use 'select_account' instead if you prefer an account chooser (e.g. for Google)
      prompt: 'login'
    }
  }),
  logout: handleLogout({
    logoutParams: {
      returnTo: '/',
      federated: true
    }
  })
});
