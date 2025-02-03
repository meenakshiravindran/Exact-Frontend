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

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

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
  useEffect(() => {
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

  const rows = students.map((student) => ({
    id: student.student_id,
    name: student.name,
    register_no: student.register_no,
    year_of_admission: student.year_of_admission,
  }));

  const columns = [
    { field: "name", headerName: "Name", flex: 0.2 },
    { field: "register_no", headerName: "Register No", flex: 0.2 },
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
        <h2>Manage Students</h2>
        <Box>
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

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student? This action cannot be undone.
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

export default ManageStudents;
