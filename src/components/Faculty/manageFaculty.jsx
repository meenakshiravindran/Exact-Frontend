import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageFaculties = () => {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    // Fetch all faculties
    axios.get('http://localhost:8000/get-faculty')
      .then(response => {
        setFaculties(response.data);
      })
      .catch(error => {
        console.error('Error fetching faculty data:', error);
      });
  }, []);

  const handleDelete = (facultyId) => {
    // Delete a faculty
    axios.delete(`http://localhost:8000/faculties/delete/${facultyId}/`)
      .then(() => {
        // After deletion, fetch updated faculty list
        setFaculties(faculties.filter(faculty => faculty.faculty_id !== facultyId));
      })
      .catch(error => {
        console.error('Error deleting faculty:', error);
      });
  };

  const rows = faculties.map((faculty) => ({
    id: faculty.faculty_id,
    name: faculty.name,
  }));

  const columns = [
    { field: 'name', headerName: 'Name', flex:0.8 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex:0.2,
      headerAlign: 'center',  // Aligns header text to center
      align: 'center',        // Aligns cell content (buttons) to center
      sortable:false,
      renderCell: (params) => (
        <div style={{ display: 'flex',justifyContent:'center' }}>
          <Link to={`/edit-faculty/${params.row.id}`}>
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
          <h2>Manage Faculties</h2>
        </Box>
        <Box>
          <Link to="/add-faculty">
            <Button variant="contained" color="success">
              Add New Faculty
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

export default ManageFaculties;
