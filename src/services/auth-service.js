// src/services/auth-service.js
import auth0 from 'auth0-js';

const config = {
  domain: 'dev-5giozvplijcqa2pc.us.auth0.com',
  clientID: 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  redirectUri: 'https://aquamarine-shortbread-a36146.netlify.app/callback',
  responseType: 'token id_token',
  scope: 'openid profile email'
};

const authClient = new auth0.WebAuth(config);

export const login = () => {
  console.log('Login started with config:', config);
  authClient.authorize();
};

export const handleAuthentication = () => {
  console.log('Processing authentication callback');
  return new Promise((resolve, reject) => {
    authClient.parseHash((err, result) => {
      if (err) {
        console.error('Auth error:', err);
        reject(err);
        return;
      }
      if (!result) {
        console.log('No authentication result');
        resolve(null);
        return;
      }
      console.log('Authentication successful');
      localStorage.setItem('access_token', result.accessToken);
      localStorage.setItem('id_token', result.idToken);
      resolve(result);
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