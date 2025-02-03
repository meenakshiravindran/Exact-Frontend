import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    // Fetch all courses
    axios.get('http://localhost:8000/get-courses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching course data:', error);
      });
  }, []);

  const handleDelete = () => {
    // Delete the selected course
    axios.delete(`http://localhost:8000/courses/delete/${selectedCourseId}/`)
      .then(() => {
        setCourses(courses.filter(course => course.course_id !== selectedCourseId));
        setOpen(false);
      })
      .catch(error => {
        console.error('Error deleting course:', error);
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

  const rows = courses.map((course) => ({
    id: course.course_id,
    title: course.title,
    department: course.dept,
    programme:course.programme,
  }));

  const columns = [
    { field: 'title', headerName: 'Course Title', flex: 0.5 },
    { field: 'department', headerName: 'Department', flex: 0.3 },
    { field: 'programme', headerName: 'Programme', flex: 0.3 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.2,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to={`/edit-course/${params.row.id}`}>
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
        <Box>
          <h2>Manage Courses</h2>
        </Box>
        <Box>
          <Link to="/add-course">
            <Button variant="contained" color="success">
              Add New Course
            </Button>
          </Link>
        </Box>
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          slots={{ toolbar: GridToolbar }}
        />
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course? This action cannot be undone.
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
