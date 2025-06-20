import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, ListItemText, MenuItem, Paper, Alert, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Pagination from '@mui/material/Pagination';

const CATEGORY_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('income');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('income');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);

  // Fetch categories from API
  const fetchCategories = async (pageNum = 1) => {
    const token = localStorage.getItem('access');
    const res = await fetch(`http://127.0.0.1:8000/api/categories/?page=${pageNum}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setCategories(Array.isArray(data.results) ? data.results : []);
      setCount(Math.ceil((data.count || 1) / 2)); // 3 per page
    } else {
      setCategories([]);
      setCount(1);
    }
  };

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  // Handle adding a new category
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access');
    const res = await fetch('http://127.0.0.1:8000/api/categories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, type }),
    });
    if (res.ok) {
      setName('');
      setType('income');
      setSuccess('Category added!');
      fetchCategories(); // This must be called here
    } else {
      setError('Could not add category');
    }
  };

  // Start editing a category
  const handleEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditType(cat.type);
    setError('');
    setSuccess('');
  };

  // Save edited category
  const handleEditSave = async (id) => {
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access');
    const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editName, type: editType }),
    });
    if (res.ok) {
      setEditId(null);
      setEditName('');
      setEditType('income');
      setSuccess('Category updated!');
      fetchCategories();
    } else {
      setError('Could not update category');
    }
  };

  // Delete a category
  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    const token = localStorage.getItem('access');
    const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSuccess('Category deleted!');
      fetchCategories();
    } else {
      setError('Could not delete category');
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditId(null);
    setEditName('');
    setEditType('income');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        background: 'none',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, minWidth: 350, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#5e35b1', mb: 2 }}>
          Manage Categories
        </Typography>
        {/* Show error or success messages */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {/* Add category form */}
        <form onSubmit={handleAdd}>
          <TextField
            label="Category Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Type"
            value={type}
            onChange={e => setType(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            {CATEGORY_TYPES.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ fontWeight: 'bold', fontSize: '1.1rem', mb: 2 }}>
            Add Category
          </Button>
        </form>
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: '#3949ab' }}>
          Your Categories
        </Typography>
        {/* List of categories with edit/delete options */}
        <List>
          {Array.isArray(categories) && categories.map(cat => (
            <ListItem key={cat.id} sx={{ justifyContent: 'space-between' }}>
              {editId === cat.id ? (
                // Edit mode
                <>
                  <TextField
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    size="small"
                    sx={{ mr: 1, width: 100 }}
                  />
                  <TextField
                    select
                    value={editType}
                    onChange={e => setEditType(e.target.value)}
                    size="small"
                    sx={{ mr: 1, width: 100 }}
                  >
                    {CATEGORY_TYPES.map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </TextField>
                  <IconButton onClick={() => handleEditSave(cat.id)} color="primary">
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={handleEditCancel} color="secondary">
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                // View mode
                <>
                  <ListItemText
                    primary={cat.name}
                    secondary={cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                  />
                  <IconButton onClick={() => handleEdit(cat)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cat.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
        </List>
        {/* Pagination controls */}
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

export default CategoryManager;