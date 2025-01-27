import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithConfig = ({ children }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-5giozvplijcqa2pc.us.auth0.com';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY';
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL || 'https://learningapp57.netlify.app/callback';

  const onRedirectCallback = (appState) => {
    console.log('Redirect callback:', appState);
    window.history.replaceState(
      {},
      document.title,
      appState?.returnTo || window.location.pathname
    );
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
        audience: "https://dev-5giozvplijcqa2pc.us.auth0.com/api/v2/"
      }}
      onRedirectCallback={onRedirectCallback}
      onError={onError}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithConfig;