import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Grid, Card, CardContent, CircularProgress, Dialog, DialogTitle, DialogContent, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CategoryManager from '../components/CategoryManager';
import TransactionManager from '../components/TransactionManager';
import BudgetManager from '../components/BudgetManager';
import { useNavigate } from 'react-router-dom';

function Dashboard({ onLogout }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7) + '-01'); // default to current month
  const username = localStorage.getItem('username') || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const token = localStorage.getItem('access');
      const res = await fetch('http://127.0.0.1:8000/api/summary/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSummary(await res.json());
      }
      setLoading(false);
    };
    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/'); 
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        p: 4,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#5e35b1', textAlign: 'center' }}>
          Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: '#3949ab', mb: 4, textAlign: 'center' }}>
          Hi {username.charAt(0).toUpperCase() + username.slice(1)}, your financial summary at a glance
        </Typography>

        {/* Month Selector */}
        {/* <TextField
          label="Month"
          type="month"
          value={month.slice(0, 7)} // show only YYYY-MM in the input
          onChange={e => setMonth(e.target.value + '-01')} // always set as YYYY-MM-01
          fullWidth
          required
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        /> */}

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#e1bee7' }}>
              <CardContent>
                <Typography variant="subtitle1">Total Income</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {loading ? <CircularProgress size={20} /> : summary?.income ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#ffcdd2' }}>
              <CardContent>
                <Typography variant="subtitle1">Total Expenses</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {loading ? <CircularProgress size={20} /> : summary?.expenses ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#b2dfdb' }}>
              <CardContent>
                <Typography variant="subtitle1">Balance</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {loading ? <CircularProgress size={20} /> : summary?.balance ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#ffe082' }}>
              <CardContent>
                <Typography variant="subtitle1">Monthly Budget</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {loading ? <CircularProgress size={20} /> : summary?.budget ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ bgcolor: '#c5e1a5' }}>
              <CardContent>
                <Typography variant="subtitle1">Budget Remaining</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {loading ? <CircularProgress size={20} /> : summary?.budget_remaining ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Category Manager */}
        {/* <CategoryManager /> */}

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, minHeight: 300, textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Expenses by Category (Pie/Donut Chart)</Typography>
              <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                [D3.js Pie/Donut Chart Placeholder]
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, minHeight: 300, textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Income vs Expenses (Bar/Line Chart)</Typography>
              <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                [D3.js Bar/Line Chart Placeholder]
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Transactions & Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, minHeight: 180 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Recent Transactions</Typography>
              <Box sx={{ color: '#aaa' }}>
                [Recent transactions list placeholder]
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, minHeight: 180 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2, width: '100%' }}
                startIcon={<AddIcon />}
                onClick={() => setTransactionDialogOpen(true)}
              >
                Add Transaction
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mb: 2, width: '100%' }}
                onClick={() => setCategoryDialogOpen(true)}
              >
                Manage Categories
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ width: '100%' }}
                onClick={() => setBudgetDialogOpen(true)}
              >
                Set/View Budget
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Manage Categories Dialog */}
        <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} maxWidth="sm" fullWidth>
            <IconButton
              aria-label="close"
              onClick={() => setCategoryDialogOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          <DialogContent>
            <CategoryManager />
          </DialogContent>
        </Dialog>

        {/* Transaction Manager Dialog */}
        <Dialog open={transactionDialogOpen} onClose={() => setTransactionDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Manage Transactions
            <IconButton
              aria-label="close"
              onClick={() => setTransactionDialogOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TransactionManager />
          </DialogContent>
        </Dialog>

        {/* Budget Manager Dialog */}
        <Dialog open={budgetDialogOpen} onClose={() => setBudgetDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Manage Monthly Budget
            <IconButton
              aria-label="close"
              onClick={() => setBudgetDialogOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <BudgetManager />
          </DialogContent>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default Dashboard;