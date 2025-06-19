import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Paper, Alert, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch categories and transactions
  const fetchCategories = async () => {
    const token = localStorage.getItem('access');
    const res = await fetch('http://127.0.0.1:8000/api/categories/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setCategories(await res.json());
  };

  const fetchTransactions = async () => {
    const token = localStorage.getItem('access');
    const res = await fetch('http://127.0.0.1:8000/api/transactions/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTransactions(await res.json());
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  // Add transaction
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access');
    const res = await fetch('http://127.0.0.1:8000/api/transactions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        category_id: categoryId,
        date,
        description,
      }),
    });
    if (res.ok) {
      setAmount('');
      setCategoryId('');
      setDate('');
      setDescription('');
      setSuccess('Transaction added!');
      fetchTransactions();
    } else {
      setError('Could not add transaction');
    }
  };

  // Start editing
  const handleEdit = (txn) => {
    setEditId(txn.id);
    setEditData({
      amount: txn.amount,
      category: txn.category,
      date: txn.date,
      description: txn.description,
    });
    setError('');
    setSuccess('');
  };

  // Save edited transaction
  const handleEditSave = async (id) => {
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access');
    const res = await fetch(`http://127.0.0.1:8000/api/transactions/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: editData.amount,
        category_id: editData.category.id ? editData.category.id : editData.category, // always send category_id
        date: editData.date,
        description: editData.description,
      }),
    });
    if (res.ok) {
      setEditId(null);
      setEditData({});
      setSuccess('Transaction updated!');
      fetchTransactions();
    } else {
      setError('Could not update transaction');
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access');
    const res = await fetch(`http://127.0.0.1:8000/api/transactions/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSuccess('Transaction deleted!');
      fetchTransactions();
    } else {
      setError('Could not delete transaction');
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, minWidth: 350, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5e35b1', mb: 2 }}>
          Manage Transactions
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {/* Add transaction form */}
        <form onSubmit={handleAdd}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Category"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name} ({cat.type})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ fontWeight: 'bold', fontSize: '1.1rem', mb: 2 }}>
            Add Transaction
          </Button>
        </form>
        {/* Transactions Table */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#3949ab' }}>
          Your Transactions
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(txn => (
                <TableRow key={txn.id}>
                  {editId === txn.id ? (
                    <>
                      <TableCell>
                        <TextField
                          value={editData.amount}
                          onChange={e => setEditData({ ...editData, amount: e.target.value })}
                          type="number"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={editData.category}
                          onChange={e => setEditData({ ...editData, category: e.target.value })}
                          size="small"
                        >
                          {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>
                              {cat.name} ({cat.type})
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editData.date}
                          onChange={e => setEditData({ ...editData, date: e.target.value })}
                          type="date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={editData.description}
                          onChange={e => setEditData({ ...editData, description: e.target.value })}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEditSave(txn.id)} color="primary">
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleEditCancel} color="secondary">
                          <CancelIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{txn.amount}</TableCell>
                      <TableCell>
                        {txn.category?.name || ''}
                        {' '}
                        ({txn.category?.type || ''})
                      </TableCell>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell>{txn.description}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleEdit(txn)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(txn.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default TransactionManager;