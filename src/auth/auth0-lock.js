import Auth0Lock from 'auth0-lock';

const lockConfig = {
  auth: {
    responseType: 'token id_token',
    redirectUrl: 'https://learningapp57.netlify.app',
    params: {
      scope: 'openid profile email'
    }
  },
  allowShowPassword: true,
  theme: {
    primaryColor: '#28a745'
  },
  languageDictionary: {
    title: 'Language Learning App'
  }
};

const lock = new Auth0Lock(
  'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  'dev-5giozvplijcqa2pc.us.auth0.com',
  lockConfig
);

// Add debugging logs
lock.on('show', () => {
  console.log('Lock shown');
});

lock.on('hide', () => {
  console.log('Lock hidden');
});

lock.on('authenticated', (authResult) => {
  console.log('Authentication successful:', authResult);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('access_token', authResult.accessToken);
  window.location.href = '/';
});

lock.on('authorization_error', (error) => {
  console.error('Authentication error:', error);
});

export default lock;