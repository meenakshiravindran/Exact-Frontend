import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageBatches = () => {
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/get-batches/')
      .then(response => setBatches(response.data))
      .catch(error => console.error('Error fetching batch data:', error));
  }, []);

  const handleOpenDialog = (batchId) => {
    setSelectedBatchId(batchId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedBatchId(null);
  };

  const handleDelete = () => {
    if (selectedBatchId) {
      axios.delete(`http://localhost:8000/batches/delete/${selectedBatchId}/`)
        .then(() => {
          setBatches(batches.filter(batch => batch.batch_id !== selectedBatchId));
          handleCloseDialog();
        })
        .catch(error => console.error('Error deleting batch:', error));
    }
  };

  const rows = batches.map((batch) => ({
    id: batch.batch_id,
    course: batch.course,
    faculty: batch.faculty,
    year: batch.year,
    part: batch.part,
    active: batch.active ? 'Yes' : 'No',
  }));

  const columns = [
    { field: 'course', headerName: 'Course', flex: 0.2 },
    { field: 'faculty', headerName: 'Faculty', flex: 0.2 },
    { field: 'year', headerName: 'Year', flex: 0.1 },
    { field: 'part', headerName: 'Part', flex: 0.1 },
    { field: 'active', headerName: 'Active', flex: 0.1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.3,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to={`/edit-batch/${params.row.id}`}>
            <IconButton color="primary" size="small" sx={{ marginRight: 1 }}>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleOpenDialog(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Container sx={{ marginTop: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h2>Manage Batches</h2>
        <Link to="/add-batch">
          <Button variant="contained" color="success">
            Add New Batch
          </Button>
        </Link>
      </Box>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this batch? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBatches;
