import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Auth0ProviderWithConfig = ({ children }) => {
  const navigate = useNavigate();
  
  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain="dev-5giozvplijcqa2pc.us.auth0.com"
      clientId="hjqwcbJXC0HFUSiFBujw5SyGt8Y3Q8dY"
      authorizationParams={{
        redirect_uri: "https://learningapp57.netlify.app/callback",
        audience: "https://dev-5giozvplijcqa2pc.us.auth0.com/api/v2/",
        scope: "openid profile email"
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithConfig;