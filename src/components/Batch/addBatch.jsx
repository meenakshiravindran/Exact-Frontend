import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BatchForm = () => {
  const [formData, setFormData] = useState({
    course: "",
    faculty_id: "",
    year: "",
    part: "",
    active: false,
  });

  const [errors, setErrors] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch faculties and courses on component mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-faculty/");
        setFaculties(response.data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-courses/");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchFaculties();
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-batch/", formData);
      alert("Batch created successfully.");
      setFormData({
        course: "",
        faculty_id: "",
        year: "",
        part: "",
        active: false,
      });
      navigate('/manage-batches');
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Add Batch
        </Typography>

        {/* Course Dropdown */}
        <FormControl fullWidth margin="normal" error={!!errors.course}>
          <InputLabel id="course-label">Course</InputLabel>
          <Select
            labelId="course-label"
            label="Course"
            name="course"
            value={formData.course}
            onChange={handleChange}
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
          {errors.course && (
            <Typography variant="caption" color="error">
              {errors.course}
            </Typography>
          )}
        </FormControl>

        {/* Faculty Dropdown */}
        <FormControl fullWidth margin="normal" error={!!errors.faculty_id}>
          <InputLabel id="faculty-label">Faculty</InputLabel>
          <Select
            labelId="faculty-label"
            label="Faculty"
            name="faculty_id"
            value={formData.faculty_id}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Faculty</em>
            </MenuItem>
            {faculties.map((faculty) => (
              <MenuItem key={faculty.faculty_id} value={faculty.faculty_id}>
                {faculty.name}
              </MenuItem>
            ))}
          </Select>
          {errors.faculty_id && (
            <Typography variant="caption" color="error">
              {errors.faculty_id}
            </Typography>
          )}
        </FormControl>

        {/* Year Input */}
        <TextField
          fullWidth
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          error={!!errors.year}
          helperText={errors.year}
          margin="normal"
        />

        {/* Part Input */}
        <TextField
          fullWidth
          label="Part"
          name="part"
          value={formData.part}
          onChange={handleChange}
          error={!!errors.part}
          helperText={errors.part}
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
          <Typography variant="body1" sx={{ ml: 1 }}>
            Active
          </Typography>
        </Box>

        {/* Submit Button */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-batches")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default BatchForm;
