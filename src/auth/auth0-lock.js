import Auth0Lock from 'auth0-lock';

const config = {
  auth: {
    redirectUrl: 'https://learningapp57.netlify.app',
    responseType: 'token id_token',
    params: {
      scope: 'openid profile email'
    }
  },
  allowShowPassword: true,
  closable: true,
  theme: {
    primaryColor: '#28a745'
  },
  languageDictionary: {
    title: 'Language Learning App'
  },
  autoclose: true
};

console.log('Initializing Auth0 Lock with config:', config);

const lock = new Auth0Lock(
  'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  'dev-5giozvplijcqa2pc.us.auth0.com',
  config
);

lock.on('authenticated', function(authResult) {
  console.log('Auth Result:', authResult);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('access_token', authResult.accessToken);
  window.location.reload();
});

lock.on('authorization_error', function(error) {
  console.error('Authorization Error:', error);
});

export default lock;