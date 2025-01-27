import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth0ProviderWithConfig from './auth/auth0-provider-with-config';
import App from './App';
import Callback from './components/Callback';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Auth0ProviderWithConfig>
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route path="/" element={<App />} />
        </Routes>
      </Auth0ProviderWithConfig>
    </Router>
  </React.StrictMode>
);