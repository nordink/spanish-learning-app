// src/auth/auth0-client.js
import auth0 from 'auth0-js';

console.log('Initializing Auth0 client...');

const auth0Client = new auth0.WebAuth({
  domain: 'dev-5giozvplijcqa2pc.us.auth0.com',
  clientID: 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  redirectUri: 'https://aquamarine-shortbread-a36146.netlify.app/callback',
  responseType: 'code',
  scope: 'openid profile email'
});

const login = () => {
  console.log('Starting login process...'); 
  auth0Client.authorize();
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