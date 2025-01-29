// src/auth/auth0-client.js
import auth0 from 'auth0-js';

const CALLBACK_URL = 'https://aquamarine-shortbread-a36146.netlify.app/callback';

console.log('Configuring Auth0 with callback URL:', CALLBACK_URL);

const auth0Client = new auth0.WebAuth({
  domain: 'dev-5giozvplijcqa2pc.us.auth0.com',
  clientID: 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  redirectUri: CALLBACK_URL,
  audience: 'https://dev-5giozvplijcqa2pc.us.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid profile email'
});

const login = () => {
  console.log('Starting login with callback URL:', CALLBACK_URL);
  auth0Client.authorize({
    redirectUri: CALLBACK_URL
  });
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