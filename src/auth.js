// src/auth.js
import auth0 from 'auth0-js';

const DOMAIN = 'dev-5giozvplijcqa2pc.us.auth0.com';
const CLIENT_ID = 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY';
const REDIRECT_URI = 'https://aquamarine-shortbread-a36146.netlify.app/callback';

console.log('Configuring auth with:', { DOMAIN, CLIENT_ID, REDIRECT_URI });

const auth = new auth0.WebAuth({
  domain: DOMAIN,
  clientID: CLIENT_ID,
  redirectUri: REDIRECT_URI,
  audience: `https://${DOMAIN}/userinfo`,
  responseType: 'code',
  scope: 'openid profile email'
});

export const login = () => {
  console.log('Starting authorization...');
  auth.authorize({
    connection: 'google-oauth2'  // Explicitly use Google OAuth
  });
};

export const handleAuthentication = () => {
  return new Promise((resolve, reject) => {
    auth.parseHash((err, authResult) => {
      if (err) {
        console.error('Auth error:', err);
        reject(err);
        return;
      }
      if (!authResult) {
        console.log('No auth result');
        resolve(null);
        return;
      }
      console.log('Auth successful');
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      resolve(authResult);
    });
  });
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  window.location.href = '/';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('id_token');
};