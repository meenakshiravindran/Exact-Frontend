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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUpload from "@mui/icons-material/FileUpload";
import { useDropzone } from "react-dropzone";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch all courses
    axios
      .get("http://localhost:8000/get-courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
      });
  }, []);

  const handleDelete = () => {
    // Delete the selected course
    axios
      .delete(`http://localhost:8000/courses/delete/${selectedCourseId}/`)
      .then(() => {
        setCourses(
          courses.filter((course) => course.course_id !== selectedCourseId)
        );
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
      });
  };

  const handleDialogOpen = (courseId) => {
    setSelectedCourseId(courseId);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedCourseId(null);
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload-courses/", formData);
      setUploadSuccess(true);
      setFile(null);
      setUploadDialogOpen(false);
      axios
        .get("http://localhost:8000/get-courses")
        .then((response) => setCourses(response.data));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const rows = courses.map((course) => ({
    id: course.course_id,
    title: course.title,
    department: course.dept,
  }));

  const columns = [
    { field: "title", headerName: "Course Title", flex: 0.5 },
    { field: "department", headerName: "Department", flex: 0.3 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to={`/edit-course/${params.row.id}`}>
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
        <h2>Manage Courses</h2>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<FileUpload />}
            onClick={handleUploadDialogOpen}
          >
            Upload CSV
          </Button>
          <Link to="/add-course">
            <Button variant="contained" color="success">
              Add New Course
            </Button>
          </Link>
        </Box>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        slots={{ toolbar: GridToolbar }}
      />
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
          <Button onClick={handleUpload} variant="contained" disabled={!file}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course? This action cannot be
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

export default ManageCourses;
