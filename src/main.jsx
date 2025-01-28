import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { handleAuthentication } from './auth/auth0-client';

// Handle authentication if we're returning from Auth0
if (window.location.hash) {
  handleAuthentication()
    .then(() => {
      window.location.hash = '';
      window.location.pathname = '/';
    })
    .catch(err => console.error('Authentication error:', err));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);