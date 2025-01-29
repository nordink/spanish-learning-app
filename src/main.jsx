import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { handleAuthentication } from './auth';

const Callback = () => {
  React.useEffect(() => {
    handleAuthentication()
      .then(() => {
        window.location.pathname = '/';
      })
      .catch(err => console.error('Authentication error:', err));
  }, []);

  return <div>Loading...</div>;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);