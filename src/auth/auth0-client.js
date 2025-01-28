// src/auth/auth0-client.js
import auth0 from 'auth0-js';

const domain = 'dev-5giozvplijcqa2pc.us.auth0.com';
const clientId = 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY';
const redirectUri = 'https://learningapp57.netlify.app/callback';

const auth0Client = new auth0.WebAuth({
  domain,
  clientID: clientId,
  redirectUri,
  responseType: 'token id_token',
  scope: 'openid profile email'
});

const login = () => {
  console.log('Initiating login with config:', {
    domain,
    clientId,
    redirectUri
  });
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
      
      if (!authResult) {
        console.log('No auth result');
        resolve(null);
        return;
      }
      
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('Authentication successful');
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        resolve(authResult);
      } else {
        console.error('Missing tokens in auth result');
        reject(new Error('Missing tokens in auth result'));
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