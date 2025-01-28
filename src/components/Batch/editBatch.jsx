import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";

const EditBatch = () => {
  const { batchId } = useParams();
  const [formData, setFormData] = useState({
    course: "",
    faculty: "",
    year: "",
    part: "",
    active: false,
  });
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current batch details
    axios
      .get(`http://localhost:8000/batches/${batchId}/`)
      .then((response) => {
        setFormData({
          course: response.data.course, // Current course ID
          faculty: response.data.faculty, // Current faculty ID
          year: response.data.year,
          part: response.data.part,
          active: response.data.active,
        });
      })
      .catch((error) => {
        console.error("Error fetching batch data:", error);
      });

    // Fetch courses list
    axios
      .get("http://localhost:8000/get-courses/")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });

    // Fetch faculties list
    axios
      .get("http://localhost:8000/get-faculty/")
      .then((response) => {
        setFaculties(response.data);
      })
      .catch((error) => {
        console.error("Error fetching faculties:", error);
      });
  }, [batchId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/batches/edit/${batchId}/`, formData)
      .then(() => {
        navigate("/manage-batches");
      })
      .catch((error) => {
        console.error("Error updating batch:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Edit Batch</h2>
      <form onSubmit={handleSubmit}>
        {/* Course Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="course-label">Course</InputLabel>
          <Select
            labelId="course-label"
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>Select Course</em>
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course.course_id} value={course.title}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Faculty Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="faculty-label">Faculty</InputLabel>
          <Select
            labelId="faculty-label"
            label="Faculty"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>Select Faculty</em>
            </MenuItem>
            {faculties.map((faculty) => (
              <MenuItem key={faculty.faculty_id} value={faculty.name}>
                {faculty.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Input */}
        <TextField
          fullWidth
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Part Input */}
        <TextField
          fullWidth
          label="Part"
          name="part"
          value={formData.part}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Active Checkbox */}
        <Box display="flex" alignItems="center" margin="normal">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          <label>Active</label>
        </Box>

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-batches")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update Batch
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditBatch;
