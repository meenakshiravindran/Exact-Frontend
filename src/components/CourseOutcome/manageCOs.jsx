import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageCO = () => {
  const [cos, setCOs] = useState([]);

  useEffect(() => {
    // Fetch all COs
    axios.get('http://localhost:8000/get-cos')
      .then(response => {
        setCOs(response.data);
      })
      .catch(error => {
        console.error('Error fetching CO data:', error);
      });
  }, []);

  const handleDelete = (coId) => {
    // Delete a CO
    axios.delete(`http://localhost:8000/cos/delete/${coId}/`)
      .then(() => {
        // After deletion, fetch updated CO list
        setCOs(cos.filter(co => co.co_id !== coId));
      })
      .catch(error => {
        console.error('Error deleting CO:', error);
      });
  };

  const rows = cos.map((co) => ({
    id: co.co_id,
    label: co.co_label,
    description: co.co_description,
  }));

  const columns = [
    { field: 'label', headerName: 'CO Label', flex: 0.3 },
    { field: 'description', headerName: 'Description', flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to={`/edit-co/${params.row.id}`}>
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
          <h2>Manage COs</h2>
        </Box>
        <Box>
          <Link to="/add-co">
            <Button variant="contained" color="success">
              Add New CO
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

export default ManageCO;
