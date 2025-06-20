import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Pagination from '@mui/material/Pagination';

function TransactionManager() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false); // Track dialog open state

  // Fetch categories
  const fetchCategories = async () => {
    const token = localStorage.getItem('access');
    const res = await fetch('http://127.0.0.1:8000/api/categories/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCategories(Array.isArray(data.results) ? data.results : []);
    } else {
      setCategories([]);
    }
  };

  const fetchAllCategories = async () => {
    const token = localStorage.getItem('access');
    let allCategories = [];
    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        allCategories = allCategories.concat(data.results);
        if (data.next) {
          page += 1;
        } else {
          hasNext = false;
        }
      } else {
        hasNext = false;
      }
    }
    setCategories(allCategories);
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Fetch transactions
  const fetchTransactions = async (pageNum = 1) => {
    const token = localStorage.getItem('access');
    const res = await fetch(`http://127.0.0.1:8000/api/transactions/?page=${pageNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setTransactions(Array.isArray(data.results) ? data.results : []);
      setCount(Math.ceil((data.count || 1) / 2)); // 3 per page
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

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
      category: txn.category.id,
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
        category_id: editData.category,
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
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
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
                {cat.name}
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
        <TableContainer>
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
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No transactions found.</TableCell>
                </TableRow>
              ) : (
                transactions.map(txn => (
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
                                {cat.name}
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
                        <TableCell>{txn.category?.name || ''}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={count}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default TransactionManager;