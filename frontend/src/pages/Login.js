import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import budgetImg from '../assests/budget.png'; // Adjust the path as necessary

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('username', username);
        onLogin();
        navigate('/dashboard'); // Navigate to dashboard on successful login
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, textAlign: 'center', maxWidth: 400 }}>
        <img
          src={budgetImg}
          alt="Budget Tracker"
          style={{ width: '120px', marginBottom: '20px' }}
        />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#5e35b1' }}>
          Login
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: '#3949ab', mb: 2 }}>
          Enter your credentials to access your budget dashboard.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;