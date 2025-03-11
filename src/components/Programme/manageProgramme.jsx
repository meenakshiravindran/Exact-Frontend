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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProgramme from "./addProgramme";
import EditProgramme from "./editProgramme";

const ManageProgrammes = () => {
  const [programmes, setProgrammes] = useState([]);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchProgrammes = () => {
    axios
      .get("http://localhost:8000/get-programme/")
      .then((response) => setProgrammes(response.data))
      .catch((error) => console.error("Error fetching programme data:", error));
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const handleOpenEditDrawer = (programmeId) => {
    setSelectedProgrammeId(programmeId);
    setOpenEditDrawer(true);
  };

  const handleOpenDeleteDialog = (programmeId) => {
    setSelectedProgrammeId(programmeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProgramme = () => {
    axios
      .delete(`http://localhost:8000/programmes/delete/${selectedProgrammeId}/`)
      .then(() => {
        setProgrammes((prev) =>
          prev.filter(
            (programme) => programme.programme_id !== selectedProgrammeId
          )
        );
        setDeleteDialogOpen(false);
      })
      .catch((error) => console.error("Error deleting programme:", error));
  };

  const rows = programmes.map((programme) => ({
    id: programme.programme_id,
    programme_name: programme.programme_name,
    department: programme.department,
    level: programme.level,
  }));

  const columns = [
    { field: "programme_name", headerName: "Programme Name", flex: 0.3 },
    { field: "department", headerName: "Department", flex: 0.2 },
    { field: "level", headerName: "Level", flex: 0.2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" ,height: "100%",width:"100%"}}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleOpenEditDrawer(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleOpenDeleteDialog(params.row.id)}
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
        <h2>Manage Programmes</h2>
        <Button variant="contained" onClick={() => setOpenAddDrawer(true)}>
          Add New Programme
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        slots={{ Toolbar: GridToolbar }}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this programme? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProgramme} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddProgramme
        open={openAddDrawer}
        onClose={() => setOpenAddDrawer(false)}
        refreshProgrammes={fetchProgrammes}
      />
      <EditProgramme
        open={openEditDrawer}
        onClose={() => setOpenEditDrawer(false)}
        programmeId={selectedProgrammeId}
        refreshProgrammes={fetchProgrammes}
      />
    </Container>
  );
};

export default ManageProgrammes;
