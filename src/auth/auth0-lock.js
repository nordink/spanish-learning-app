import Auth0Lock from 'auth0-lock';

const lockConfig = {
  auth: {
    responseType: 'token id_token',
    redirectUrl: 'https://learningapp57.netlify.app',
    params: {
      scope: 'openid profile email'
    }
  },
  container: 'auth0-login-container',
  allowShowPassword: true,
  theme: {
    primaryColor: '#28a745'
  },
  languageDictionary: {
    title: 'Language Learning App'
  },
  hashCleanup: true
};

const lock = new Auth0Lock(
  'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  'dev-5giozvplijcqa2pc.us.auth0.com',
  lockConfig
);

export default lock;