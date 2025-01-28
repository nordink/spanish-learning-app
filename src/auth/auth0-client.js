// src/auth/auth0-client.js
import auth0 from 'auth0-js';

const auth0Client = new auth0.WebAuth({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirectUri: window.location.origin,
  responseType: 'token id_token',
  scope: 'openid profile email'
});

const login = () => {
  auth0Client.authorize();
};

const handleAuthentication = () => {
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
      }
    });
  });
};

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  window.location.href = '/';
};

const isAuthenticated = () => {
  const token = localStorage.getItem('id_token');
  return !!token;
};

export { login, handleAuthentication, logout, isAuthenticated };