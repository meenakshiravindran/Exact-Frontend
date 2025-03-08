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

const AddCourse = () => {
  const [formData, setFormData] = useState({
    course_code: "",
    title: "",
    dept: "",
    semester: "",
    credits: "",
    no_of_cos: "",
    syllabus_year: "",
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  // Fetch departments and programmes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptResponse = await axios.get("http://localhost:8000/get-department/");
        setDepartments(deptResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/add-course/", formData);
      alert("Course added successfully.");
      setFormData({
        course_code: "",
        title: "",
        dept: "",
        semester: "",
        credits: "",
        no_of_cos: "",
        syllabus_year: "",
      });
      navigate("/manage-courses");
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
          Add Course
        </Typography>

        {/* Course Code Input */}
        <TextField
          fullWidth
          label="Course Code"
          name="course_code"
          value={formData.course_code}
          onChange={handleChange}
          error={!!errors.course_code}
          helperText={errors.course_code}
          margin="normal"
        />

        {/* Title Input */}
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          margin="normal"
        />

        {/* Department Dropdown */}
        <FormControl fullWidth margin="normal" error={!!errors.dept}>
          <InputLabel id="dept-label">Department</InputLabel>
          <Select
            labelId="dept-label"
            label="Department"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Department</em>
            </MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.dept_id} value={dept.dept_name}>
                {dept.dept_name}
              </MenuItem>
            ))}
          </Select>
          {errors.dept && (
            <Typography variant="caption" color="error">
              {errors.dept}
            </Typography>
          )}
        </FormControl>

        {/* Semester Input */}
        <TextField
          fullWidth
          label="Semester"
          name="semester"
          type="number"
          value={formData.semester}
          onChange={handleChange}
          error={!!errors.semester}
          helperText={errors.semester}
          margin="normal"
        />

        {/* Credits Input */}
        <TextField
          fullWidth
          label="Credits"
          name="credits"
          type="number"
          value={formData.credits}
          onChange={handleChange}
          error={!!errors.credits}
          helperText={errors.credits}
          margin="normal"
        />

        {/* Number of COs Input */}
        <TextField
          fullWidth
          label="Number of COs"
          name="no_of_cos"
          type="number"
          value={formData.no_of_cos}
          onChange={handleChange}
          error={!!errors.no_of_cos}
          helperText={errors.no_of_cos}
          margin="normal"
        />

        {/* Syllabus Year Input */}
        <TextField
          fullWidth
          label="Syllabus Year"
          name="syllabus_year"
          type="number"
          value={formData.syllabus_year}
          onChange={handleChange}
          error={!!errors.syllabus_year}
          helperText={errors.syllabus_year}
          margin="normal"
        />

        {/* Submit Button */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-courses")}
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

export default AddCourse;
