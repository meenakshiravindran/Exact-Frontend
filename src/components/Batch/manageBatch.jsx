import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageBatches = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    // Fetch all batches
    axios.get('http://localhost:8000/get-batches/')
      .then(response => {
        setBatches(response.data);
      })
      .catch(error => {
        console.error('Error fetching batch data:', error);
      });
  }, []);

  const handleDelete = (batchId) => {
    // Delete a batch
    axios.delete(`http://localhost:8000/batches/delete/${batchId}/`)
      .then(() => {
        // After deletion, fetch updated batch list
        setBatches(batches.filter(batch => batch.batch_id !== batchId));
      })
      .catch(error => {
        console.error('Error deleting batch:', error);
      });
  };

  const rows = batches.map((batch) => ({
    id: batch.batch_id,
    course: batch.course,
    faculty: batch.faculty, // Assuming faculty has a `name` field
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
      headerAlign: 'center',  // Aligns header text to center
      align: 'center',        // Aligns cell content (buttons) to center
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
            onClick={() => handleDelete(params.row.id)}
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
        <Box>
          <h2>Manage Batches</h2>
        </Box>
        <Box>
          <Link to="/add-batch">
            <Button variant="contained" color="success">
              Add New Batch
            </Button>
          </Link>
        </Box>
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
        />
      </div>
    </Container>
  );
};

export default ManageBatches;
