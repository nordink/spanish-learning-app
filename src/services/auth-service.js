// src/services/auth-service.js
import auth0 from 'auth0-js';

const isDevelopment = import.meta.env.DEV;
const SITE_URL = isDevelopment 
  ? 'http://localhost:5173'
  : 'https://aquamarine-shortbread-a36146.netlify.app';

const CALLBACK_URL = `${SITE_URL}/callback`;

console.log('NEW AUTH SERVICE FILE Version: 1.0.4');
console.log('UNIQUE_DEBUG_STRING_XYZ123: Environment:', {
  isDevelopment,
  SITE_URL,
  CALLBACK_URL
});

const config = {
  domain: 'dev-5giozvplijcqa2pc.us.auth0.com',
  clientID: 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  redirectUri: CALLBACK_URL,
  responseType: 'token id_token',
  scope: 'openid profile email',
  audience: 'https://spanish-learning-api',
};

const authClient = new auth0.WebAuth(config);

export const login = () => {
  console.log('UNIQUE_DEBUG_STRING_XYZ123: Starting login process');
  try {
    // Generate and store state
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('auth_state', state);
    
    authClient.authorize({
      state: state
    });
  } catch (error) {
    console.error('UNIQUE_DEBUG_STRING_XYZ123: Login error:', error);
    throw error;
  }
};

export const handleAuthentication = () => {
  console.log('UNIQUE_DEBUG_STRING_XYZ123: Handling authentication');
  return new Promise((resolve, reject) => {
    const savedState = localStorage.getItem('auth_state');
    authClient.parseHash({ state: savedState }, (err, result) => {
      // Clean up stored state
      localStorage.removeItem('auth_state');

      if (err) {
        console.error('UNIQUE_DEBUG_STRING_XYZ123: Auth error:', err);
        reject(err);
        return;
      }
      
      if (!result || !result.accessToken || !result.idToken) {
        console.log('UNIQUE_DEBUG_STRING_XYZ123: No auth result or missing tokens');
        resolve(null);
        return;
      }

      const expiresAt = JSON.stringify(
        result.expiresIn * 1000 + new Date().getTime()
      );

      localStorage.setItem('access_token', result.accessToken);
      localStorage.setItem('id_token', result.idToken);
      localStorage.setItem('expires_at', expiresAt);
      
      console.log('UNIQUE_DEBUG_STRING_XYZ123: Auth successful, tokens stored');
      resolve(result);
    });
  });
};

export const logout = () => {
  console.log('UNIQUE_DEBUG_STRING_XYZ123: Logging out');
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
  
  authClient.logout({
    returnTo: SITE_URL,
    clientID: config.clientID
  });
};

export const isAuthenticated = () => {
  const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '0');
  const isValid = new Date().getTime() < expiresAt;
  console.log('UNIQUE_DEBUG_STRING_XYZ123: Checking auth:', { 
    isValid, 
    expiresAt: new Date(expiresAt)
  });
  return isValid && !!localStorage.getItem('id_token');
};