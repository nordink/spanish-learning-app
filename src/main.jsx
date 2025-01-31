import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { handleAuthentication } from './services/auth-service';

const Callback = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const processAuth = async () => {
      try {
        await handleAuthentication();
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Authentication error:', err);
        navigate('/');
      }
    };

    processAuth();
  }, [navigate]);

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