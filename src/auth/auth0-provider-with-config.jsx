// src/auth/auth0-provider-with-config.jsx
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithConfig = ({ children }) => {
  const domain = 'dev-5giozvplijcqa2pc.us.auth0.com';
  const clientId = 'hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY';
  const redirectUri = window.location.origin;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: "https://dev-5giozvplijcqa2pc.us.auth0.com/",
        scope: "openid profile email"
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithConfig;