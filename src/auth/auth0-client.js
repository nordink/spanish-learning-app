// src/auth/auth0-client.js
import auth0 from 'auth0-js';

const DOMAIN = 'dev-5giozvplijcqa2pc.us.auth0.com';
const CLIENT_ID = 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY';
const CALLBACK_URL = 'https://aquamarine-shortbread-a36146.netlify.app/callback';

console.log('Initializing Auth0 client with:', {
  domain: DOMAIN,
  clientId: CLIENT_ID,
  callbackUrl: CALLBACK_URL
});

const auth0Client = new auth0.WebAuth({
  domain: DOMAIN,
  clientID: CLIENT_ID,
  redirectUri: CALLBACK_URL,
  audience: `https://${DOMAIN}/userinfo`,
  responseType: 'token id_token',
  scope: 'openid profile email'
});

const login = () => {
  console.log('Starting login process with callback URL:', CALLBACK_URL);
  auth0Client.authorize({
    redirectUri: CALLBACK_URL,
    responseType: 'token id_token'
  });
};

const handleAuthentication = () => {
  console.log('Handling authentication callback...');
  return new Promise((resolve, reject) => {
    auth0Client.parseHash({ redirectUri: CALLBACK_URL }, (err, authResult) => {
      if (err) {
        console.error('Authentication error:', err);
        reject(err);
        return;
      }
      
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('Authentication successful, storing tokens');
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        resolve(authResult);
      } else {
        console.log('No auth result or missing tokens');
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