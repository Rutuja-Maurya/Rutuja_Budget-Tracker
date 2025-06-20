import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, List, ListItem, ListItemText } from '@mui/material';

function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [amount, setAmount] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch budgets
  const fetchBudgets = async () => {
    const token = localStorage.getItem('access');
    const res = await fetch('http://127.0.0.1:8000/api/budgets/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setBudgets(Array.isArray(data.results) ? data.results : []);
    } else {
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Add budget
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access');
    const res = await fetch('http://127.0.0.1:8000/api/budgets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, year, month }),
    });
    if (res.ok) {
      setAmount('');
      setYear('');
      setMonth('');
      setSuccess('Budget set!');
      fetchBudgets();
    } else {
      setError('Could not set budget');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, minWidth: 350, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5e35b1', mb: 2 }}>
          Manage Monthly Budget
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleAdd}>
          <TextField
            label="Budget Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Month"
            type="month"
            value={year && month ? `${year}-${month.toString().padStart(2, '0')}` : ''}
            onChange={e => {
              const [y, m] = e.target.value.split('-');
              setYear(Number(y));
              setMonth(Number(m));
            }}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ fontWeight: 'bold', fontSize: '1.1rem', mb: 2 }}>
            Set Budget
          </Button>
        </form>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#3949ab' }}>
          Your Budgets
        </Typography>
        <List>
          {budgets.map(budget => (
            <ListItem key={budget.id}>
              <ListItemText
                primary={`₹${budget.amount}`}
                secondary={`${budget.month}-${budget.year}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default BudgetManager;