import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth0ProviderWithConfig from './auth/auth0-provider-with-config';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Auth0ProviderWithConfig>
        <App />
      </Auth0ProviderWithConfig>
    </Router>
  </React.StrictMode>
);