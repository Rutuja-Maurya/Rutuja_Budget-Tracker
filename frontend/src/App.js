import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onLoginClick={() => window.location.href = '/login'} />} />
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />
        } />
        {/* Add more routes for transactions, categories, etc. */}
      </Routes>
    </Router>
  );
}

export default App;