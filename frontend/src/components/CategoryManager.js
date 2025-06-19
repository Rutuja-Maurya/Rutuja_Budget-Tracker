import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem, ListItemText, MenuItem, Paper, Alert, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Category types for dropdown
const CATEGORY_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

function CategoryManager() {
  // State variables
  const [categories, setCategories] = useState([]); // List of categories
  const [name, setName] = useState(''); // New category name
  const [type, setType] = useState('income'); // New category type
  const [error, setError] = useState(''); // Error message
  const [success, setSuccess] = useState(''); // Success message
  const [editId, setEditId] = useState(null); // ID of category being edited
  const [editName, setEditName] = useState(''); // Edited category name
  const [editType, setEditType] = useState('income'); // Edited category type

  // Fetch categories from API
  const fetchCategories = async () => {
    const token = localStorage.getItem('access');
    const res = await fetch('http://127.0.0.1:8000/api/categories/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setCategories(await res.json());
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

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
      fetchCategories();
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
          {categories.map(cat => (
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
      </Paper>
    </Box>
  );
}

export default CategoryManager;