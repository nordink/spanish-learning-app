import Auth0Lock from 'auth0-lock';

const lock = new Auth0Lock(
  'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  'dev-5giozvplijcqa2pc.us.auth0.com',
  {
    auth: {
      redirectUrl: 'https://learningapp57.netlify.app/callback',
      responseType: 'code',
      params: {
        scope: 'openid profile email'
      }
    },
    allowShowPassword: true,
    closable: false,
    theme: {
      primaryColor: '#28a745'
    },
    languageDictionary: {
      title: 'Language Learning App'
    },
    autoclose: true
  }
);

lock.on('authenticated', (authResult) => {
  console.log('Authenticated:', authResult);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('access_token', authResult.accessToken);
  window.location.href = '/';
});

lock.on('authorization_error', (error) => {
  console.error('Authentication error:', error);
});

export default lock;