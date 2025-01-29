import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Box, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageProgrammes = () => {
  const [programmes, setProgrammes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState(null);

  useEffect(() => {
    // Fetch all programmes
    axios.get('http://localhost:8000/get-programme/')
      .then(response => {
        setProgrammes(response.data);
      })
      .catch(error => {
        console.error('Error fetching programme data:', error);
      });
  }, []);

  const handleOpenDialog = (programmeId) => {
    setSelectedProgramme(programmeId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProgramme(null);
  };

  const handleDelete = () => {
    if (selectedProgramme) {
      axios.delete(`http://localhost:8000/programmes/delete/${selectedProgramme}/`)
        .then(() => {
          setProgrammes(programmes.filter(programme => programme.programme_id !== selectedProgramme));
          handleCloseDialog();
        })
        .catch(error => {
          console.error('Error deleting programme:', error);
        });
    }
  };

  const rows = programmes.map((programme) => ({
    id: programme.programme_id,
    programme_name: programme.programme_name,
    department: programme.department,
    level: programme.level,
  }));

  const columns = [
    { field: 'programme_name', headerName: 'Programme Name', flex: 0.3 },
    { field: 'department', headerName: 'Department', flex: 0.2 },
    { field: 'level', headerName: 'Level', flex: 0.2 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to={`/edit-programme/${params.row.id}`}>
            <IconButton color="primary" size="small" sx={{ marginRight: 1 }}>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            color="	#d83131"
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
        <Box>
          <h2>Manage Programmes</h2>
        </Box>
        <Box>
          <Link to="/add-programme">
            <Button variant="contained" color="success">
              Add New Programme
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

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this programme? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageProgrammes;
