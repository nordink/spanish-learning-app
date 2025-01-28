// src/auth/auth0-lock.js
import Auth0Lock from 'auth0-lock';

const lock = new Auth0Lock(
  'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  'dev-5giozvplijcqa2pc.us.auth0.com',
  {
    auth: {
      redirectUrl: 'https://learningapp57.netlify.app/callback',
      responseType: 'token id_token',
      params: {
        scope: 'openid profile email'
      }
    },
    container: 'auth0-login-container',
    theme: {
      primaryColor: '#28a745'
    },
    languageDictionary: {
      title: 'Language Learning App'
    }
  }
);

// Add authentication result handler
lock.on('authenticated', (authResult) => {
  console.log('Authenticated:', authResult);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('access_token', authResult.accessToken);
  window.location.href = '/';
});

// Add authentication error handler
lock.on('authorization_error', (error) => {
  console.error('Authentication error:', error);
});

export default lock;