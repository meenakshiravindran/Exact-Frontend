import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ManagePSO = () => {
  const [programmes, setProgrammes] = useState([]); // List of Programmes
  const [selectedProgramme, setSelectedProgramme] = useState(""); // Selected Programme
  const [psos, setPsos] = useState([]); // List of PSOs
  const [open, setOpen] = useState(false); // Dialog State
  const [selectedPsoId, setSelectedPsoId] = useState(null); // PSO ID for Deletion

  // Fetch All Programmes
  useEffect(() => {
    axios
      .get("http://localhost:8000/get-programme/")
      .then((response) => {
        setProgrammes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching programme data:", error);
      });
  }, []);

  // Fetch PSOs based on Selected Programme
  useEffect(() => {
    if (selectedProgramme) {
      axios
        .get(`http://localhost:8000/psos/by-programme/${selectedProgramme}/`)
        .then((response) => {
          setPsos(response.data);
        })
        .catch((error) => {
          console.error("Error fetching PSO data:", error);
        });
    } else {
      setPsos([]); // Clear PSOs if no programme is selected
    }
  }, [selectedProgramme]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/pso/delete/${selectedPsoId}/`)
      .then(() => {
        setPsos(psos.filter((pso) => pso.pso_id !== selectedPsoId));
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting PSO:", error);
      });
  };

  const handleDialogOpen = (psoId) => {
    setSelectedPsoId(psoId);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedPsoId(null);
  };

  const rows = psos.map((pso) => ({
    id: pso.pso_id,
    pso_name: pso.pso_label,
    description: pso.pso_desc,
  }));

  const columns = [
    { field: "pso_name", headerName: "PSO Label", flex: 0.4 },
    { field: "description", headerName: "Description", flex: 0.4 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to={`/edit-pso/${params.row.id}`}>
            <IconButton color="primary" size="small" sx={{ marginRight: 1 }}>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleDialogOpen(params.row.id)}
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
        <h2>Manage PSOs</h2>
        <Box>
          <Link to="/add-pso">
            <Button variant="contained" color="success">
              Add New PSO
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Select Programme Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="programme-label">Select Programme</InputLabel>
        <Select
          labelId="programme-label"
          label="Select Programme"
          value={selectedProgramme}
          onChange={(e) => setSelectedProgramme(e.target.value)}
        >
          <MenuItem value="">
            <em>All Programmes</em>
          </MenuItem>
          {programmes.map((prog) => (
            <MenuItem key={prog.programme_id} value={prog.programme_id}>
              {prog.programme_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* PSO DataGrid */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this PSO? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagePSO;
