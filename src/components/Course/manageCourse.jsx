import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);

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

  const handleDelete = (courseId) => {
    // Delete a course
    axios.delete(`http://localhost:8000/courses/delete/${courseId}/`)
      .then(() => {
        // After deletion, fetch updated course list
        setCourses(courses.filter(course => course.course_id !== courseId));
      })
      .catch(error => {
        console.error('Error deleting course:', error);
      });
  };

  const rows = courses.map((course) => ({
    id: course.course_id,
    title: course.title,
    department: course.dept,
  }));

  const columns = [
    { field: 'title', headerName: 'Course Title', flex: 0.5 },
    { field: 'department', headerName: 'Department', flex: 0.3 },
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
            onClick={() => handleDelete(params.row.id)}
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
        />
      </div>
    </Container>
  );
};

export default ManageCourses;
