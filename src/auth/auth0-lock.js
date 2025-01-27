// src/auth/auth0-lock.js
import Auth0Lock from 'auth0-lock';

const config = {
  clientId: 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY',
  domain: 'dev-5giozvplijcqa2pc.us.auth0.com',
  options: {
    auth: {
      redirectUrl: 'https://learningapp57.netlify.app/callback',
      responseType: 'code',
      params: {
        scope: 'openid profile email'
      }
    },
    allowShowPassword: true,
    closable: false,
    languageDictionary: {
      title: "Language Learning App"
    },
    theme: {
      primaryColor: '#28a745'
    }
  }
};

const lock = new Auth0Lock(
  config.clientId,
  config.domain,
  config.options
);

export default lock;