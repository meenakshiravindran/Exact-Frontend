import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  Snackbar,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUpload from "@mui/icons-material/FileUpload";
import { useDropzone } from "react-dropzone";

const ManageFaculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false); // Track upload state

  // Fetch faculty data
  const fetchFaculties = () => {
    axios
      .get("http://localhost:8000/get-faculty")
      .then((response) => setFaculties(response.data))
      .catch((error) => console.error("Error fetching faculty data:", error));
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/faculties/delete/${selectedFacultyId}/`)
      .then(() => {
        setFaculties(
          faculties.filter(
            (faculty) => faculty.faculty_id !== selectedFacultyId
          )
        );
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting faculty:", error);
      });
  };

  const handleDialogOpen = (facultyId) => {
    setSelectedFacultyId(facultyId);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedFacultyId(null);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true); // Start loader
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload-faculty-csv/", formData);
      setUploadSuccess(true);
      setFile(null);
      setUploadDialogOpen(false);
      fetchFaculties(); // Refresh DataGrid
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false); // Stop loader
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const rows = faculties.map((faculty) => ({
    id: faculty.faculty_id,
    name: faculty.name,
    dept: faculty.dept,
  }));

  const columns = [
    { field: "name", headerName: "Name", flex: 0.8 },
    { field: "dept", headerName: "Department", flex: 0.8 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to={`/edit-faculty/${params.row.id}`}>
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <h2>Manage Faculties</h2>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<FileUpload />}
            onClick={handleUploadDialogOpen}
          >
            Upload CSV
          </Button>
          <Link to="/add-faculty">
            <Button variant="contained" color="success">
              Add New Faculty
            </Button>
          </Link>
        </Box>
      </Box>

      <DataGrid rows={rows} columns={columns} pageSize={5} />

      <Snackbar
        open={uploadSuccess}
        autoHideDuration={3000}
        onClose={() => setUploadSuccess(false)}
        message="File uploaded successfully!"
      />

      {/* Upload CSV Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <Paper
            {...getRootProps()}
            sx={{
              padding: 3,
              textAlign: "center",
              border: "2px dashed #ccc",
              cursor: "pointer",
              mb: 2,
              boxShadow: "none",
            }}
          >
            <input {...getInputProps()} />
            <FileUpload fontSize="large" />
            <Typography>
              Drag & Drop a CSV file here or click to select one
            </Typography>
          </Paper>
          {file && <Typography>Selected File: {file.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!file || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this faculty? This action cannot be
            undone.
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

export default ManageFaculties;
