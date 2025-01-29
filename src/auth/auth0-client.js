// src/auth/auth0-client.js
import auth0 from 'auth0-js';

console.log('Initializing Auth0 client...');

const config = {
  domain: 'dev-5giozvplijcqa2pc.us.auth0.com',
  clientID: 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  redirectUri: 'https://aquamarine-shortbread-a36146.netlify.app/callback',
  responseType: 'code',
  scope: 'openid profile email'
};

console.log('Auth0 configuration:', config);

const auth0Client = new auth0.WebAuth(config);

const login = () => {
  console.log('Starting login process...');
  try {
    auth0Client.authorize({
      prompt: 'login'
    });
  } catch (error) {
    console.error('Error during login:', error);
  }
};

const handleAuthentication = () => {
  console.log('Handling authentication...');
  return new Promise((resolve, reject) => {
    auth0Client.parseHash((err, authResult) => {
      console.log('Parse hash result:', err ? 'Error:' : 'Success:', err || authResult);
      
      if (err) {
        console.error('Authentication error:', err);
        reject(err);
        return;
      }
      
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('Setting tokens in localStorage');
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