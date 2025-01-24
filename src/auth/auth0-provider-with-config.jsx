import { Auth0Provider } from '@auth0/auth0-react';

export const Auth0ProviderWithConfig = ({ children }) => {
  const domain = 'dev-5giozvplijcqa2pc.us.auth0.com';  // Make sure to include the closing quote
  const clientId = 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY';  // Your client ID
  const redirectUri = window.location.origin;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri
      }}
    >
      {children}
    </Auth0Provider>
  );
};