import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { Link } from "react-router-dom";

const ManageProgrammeOutcomes = () => {
  const [pos, setPos] = useState([]); // Programme Outcomes
  const [levels, setLevels] = useState([]); // Levels dropdown data
  const [selectedLevel, setSelectedLevel] = useState(""); // Selected level
  const [open, setOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState(null);

  // Fetch all levels for dropdown
  useEffect(() => {
    axios.get("http://localhost:8000/get-level/")
      .then((response) => {
        setLevels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching levels:", error);
      });
  }, []);

  // Fetch all POs initially and filter when level changes
  useEffect(() => {
    const fetchPOs = async () => {
      const url = selectedLevel
        ? `http://localhost:8000/get-pos/${selectedLevel}/`
        : `http://localhost:8000/get-pos/`; // Fetch all if no level is selected

      try {
        const response = await axios.get(url);
        setPos(response.data);
      } catch (error) {
        console.error("Error fetching POs:", error);
      }
    };

    fetchPOs();
  }, [selectedLevel]); // Runs when selectedLevel changes

  // Handle deletion
  const handleDelete = () => {
    axios.delete(`http://localhost:8000/pos/delete/${selectedPoId}/`)
      .then(() => {
        setPos(pos.filter((po) => po.id !== selectedPoId));
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting PO:", error);
      });
  };

  // Open delete confirmation dialog
  const handleDialogOpen = (poId) => {
    setSelectedPoId(poId);
    setOpen(true);
  };

  // Close delete confirmation dialog
  const handleDialogClose = () => {
    setOpen(false);
    setSelectedPoId(null);
  };

  // Map response data to DataGrid rows
  const rows = pos.map((po) => ({
    id: po.id,
    po_label: po.po_label,
    pos_description: po.pos_description,
  }));

  // DataGrid columns
  const columns = [
    { field: "po_label", headerName: "Label", flex: 0.3 },
    { field: "pos_description", headerName: "Description", flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to={`/edit-pos/${params.row.id}`}>
            <IconButton color="primary" size="small" sx={{ marginRight: 1 }}>
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            color="error"
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
        <h2>Manage Programme Outcomes</h2>
        <Box>
          <Link to="/add-pos">
            <Button variant="contained" color="success">
              Add New PO
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Level Filter Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="level-label">Select Level</InputLabel>
        <Select
          labelId="level-label"
          label="Select Level"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <MenuItem value="">
            <em>All Levels</em>
          </MenuItem>
          {levels.map((level) => (
            <MenuItem key={level.level_id} value={level.level_id}>
              {level.level_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* DataGrid Table */}
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Programme Outcome? This action cannot be undone.
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

export default ManageProgrammeOutcomes;
