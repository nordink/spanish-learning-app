import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithConfig = ({ children }) => {
  const domain = 'dev-5giozvplijcqa2pc.us.auth0.com';
  const clientId = 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY';
  const redirectUri = 'https://learningapp57.netlify.app';

  const onRedirectCallback = (appState) => {
    console.log('Redirect callback:', appState);
  };

  const onError = (error) => {
    console.error('Auth0 error:', error);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: "https://dev-5giozvplijcqa2pc.us.auth0.com"
      }}
      onRedirectCallback={onRedirectCallback}
      onError={onError}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithConfig;