// src/auth/auth0-client.js
import auth0 from 'auth0-js';

const DOMAIN = 'dev-5giozvplijcqa2pc.us.auth0.com';
const CLIENT_ID = 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY';
const CALLBACK_URL = `https://aquamarine-shortbread-a36146.netlify.app/callback?v=${Date.now()}`;

console.log('Auth0 Config:', {
  domain: DOMAIN,
  clientId: CLIENT_ID,
  callbackUrl: CALLBACK_URL
});

const auth0Client = new auth0.WebAuth({
  domain: DOMAIN,
  clientID: CLIENT_ID,
  redirectUri: CALLBACK_URL,
  responseType: 'token id_token',
  scope: 'openid profile email'
});

const login = () => {
  const loginConfig = {
    redirectUri: CALLBACK_URL,
    responseType: 'token id_token'
  };
  console.log('Starting login with config:', loginConfig);
  auth0Client.authorize(loginConfig);
};

const handleAuthentication = () => {
  console.log('Handling authentication...');
  return new Promise((resolve, reject) => {
    auth0Client.parseHash((err, authResult) => {
      if (err) {
        console.error('Authentication error:', err);
        reject(err);
        return;
      }
      
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('Authentication successful');
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        resolve(authResult);
      } else {
        console.warn('No auth result or missing tokens');
        resolve(null);
      }
    });
  });
};

const logout = () => {
  console.log('Logging out...');
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  window.location.href = '/';
};

const isAuthenticated = () => {
  const token = localStorage.getItem('id_token');
  const result = !!token;
  console.log('Checking authentication:', result);
  return result;
};

export { login, handleAuthentication, logout, isAuthenticated };