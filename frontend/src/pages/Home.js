import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import budgetImg from '../assests/budget.png'; // Adjust the path as necessary

function Home({ onLoginClick }) {
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
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, textAlign: 'center', maxWidth: 500 }}>
        <img
          src={budgetImg}
          alt="Budget Tracker"
          style={{ width: '180px', marginBottom: '24px' }}
        />
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#5e35b1' }}>
          Personal Budget Tracker
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ color: '#3949ab' }}>
          Track your income, expenses, and monthly budget with ease.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 4, px: 5, fontWeight: 'bold', fontSize: '1.1rem' }}
          onClick={onLoginClick}
        >
          LOGIN
        </Button>
      </Paper>
    </Box>
  );
}

export default Home;