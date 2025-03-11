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
  DialogTitle,
  Snackbar,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Upload } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [open, setOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  // Function to fetch students
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        selectedProgramme
          ? `http://localhost:8000/students/by-programme/${selectedProgramme}/`
          : "http://localhost:8000/get-students/"
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedProgramme]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/students/delete/${selectedStudentId}/`)
      .then(() => {
        setStudents(
          students.filter((student) => student.student_id !== selectedStudentId)
        );
        setOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting student:", error);
      });
  };

  const handleDialogOpen = (studentId) => {
    setSelectedStudentId(studentId);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedStudentId(null);
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
      await axios.post("http://localhost:8000/upload-students/", formData);
      setUploadSuccess(true);
      setFile(null);
      setUploadDialogOpen(false);
      fetchStudents(); // Refresh DataGrid after upload
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

  const rows = students.map((student) => ({
    id: student.student_id,
    reg_no: student.register_no,
    name: student.name,
    programme_name: student["programme__programme_name"],
    year_of_admission: student.year_of_admission,
  }));

  const columns = [
    { field: "reg_no", headerName: "Register No", flex: 0.2 },
    { field: "name", headerName: "Name", flex: 0.2 },
    { field: "programme_name", headerName: "Programme", flex: 0.2 },
    { field: "year_of_admission", headerName: "Year of Admission", flex: 0.2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link to={`/edit-student/${params.row.id}`}>
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
        <h2>Manage Students</h2>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<Upload />}
            onClick={handleUploadDialogOpen}
          >
            Upload CSV
          </Button>
          <Link to="/add-student">
            <Button variant="contained" color="success">
              Add New Student
            </Button>
          </Link>
        </Box>
      </Box>

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

      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[30]}
        pageSize={10}
        pagination
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
            <CloudUploadIcon fontSize="large" />
            <Typography>
              Drag & Drop a CSV file here or click to select one
            </Typography>
          </Paper>
          {file && <Typography>Selected File: {file.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={!file}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageStudents;
