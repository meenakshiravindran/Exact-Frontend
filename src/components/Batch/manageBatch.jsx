import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Link,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBatchDrawer from "./addBatch";
import EditBatchDrawer from "./editBatch";

const ManageBatches = () => {
  const [batches, setBatches] = useState([]);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  // Fetch batches from API
  const fetchBatches = () => {
    axios
      .get("http://localhost:8000/get-batches/")
      .then((response) => setBatches(response.data))
      .catch((error) => console.error("Error fetching batch data:", error));
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/batches/delete/${selectedBatchId}/`)
      .then(() => {
        setBatches(batches.filter((batch) => batch.id !== selectedBatchId));
        setDeleteDialogOpen(false);
        fetchBatches();
      })
      .catch((error) => console.error("Error deleting batch:", error));
  };

  const handleDeleteDialogOpen = (batchId) => {
    setSelectedBatchId(batchId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedBatchId(null);
  };
  const handleEdit = (batchId) => {
    setSelectedBatchId(batchId);
    setOpenEditDrawer(true);
  };

  const rows = batches.map((batch) => ({
    id: batch.batch_id,
    course: batch.course,
    faculty: batch.faculty,
    year: batch.year,
    part: batch.part,
    active: batch.active ? "Yes" : "No",
  }));

  const columns = [
    { field: "course", headerName: "Course", flex: 1 },
    { field: "faculty", headerName: "Faculty", flex: 1 },
    { field: "year", headerName: "Year", flex: 0.5 },
    { field: "part", headerName: "Part", flex: 0.5 },
    { field: "active", headerName: "Active", flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box style={{ display: "flex", justifyContent: "center" ,height:"100%" }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteDialogOpen(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <h2>Manage Batches</h2>
        <Button variant="contained" onClick={() => setOpenAddDrawer(true)}>
          Add Batch
        </Button>
      </Box>

      <DataGrid rows={rows} columns={columns} pageSize={5} />

      <AddBatchDrawer
        open={openAddDrawer}
        onClose={() => setOpenAddDrawer(false)}
        refreshBatches={fetchBatches}
      />
      <EditBatchDrawer
        open={openEditDrawer}
        onClose={() => setOpenEditDrawer(false)}
        batchId={selectedBatchId}
        refreshBatches={fetchBatches}
      />

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this batch? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBatches;
