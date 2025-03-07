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

const EditCourse = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    course_code: "",
    title: "",
    dept: "",
    semester: "",
    credits: "",
    no_of_cos: "",
    programme: "",
    syllabus_year: "",
  });
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current course details
    axios
      .get(`http://localhost:8000/courses/${courseId}/`)
      .then((response) => {
        setFormData({
          course_code: response.data.course_code,
          title: response.data.title,
          dept: response.data.dept,
          semester: response.data.semester,
          credits: response.data.credits,
          no_of_cos: response.data.no_of_cos,
          programme: response.data.programme,
          syllabus_year: response.data.syllabus_year,
        });
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
      });

    // Fetch department list
    axios
      .get("http://localhost:8000/get-department/")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });

    // Fetch programme list
    axios
      .get("http://localhost:8000/get-programme/")
      .then((response) => {
        setProgrammes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching programmes:", error);
      });
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8000/courses/edit/${courseId}/`, formData)
      .then(() => {
        navigate("/manage-courses");
      })
      .catch((error) => {
        console.error("Error updating course:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        {/* Course Code Input */}
        <TextField
          fullWidth
          label="Course Code"
          name="course_code"
          value={formData.course_code}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Title Input */}
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Department Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="dept-label">Department</InputLabel>
          <Select
            labelId="dept-label"
            label="Department"
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
            required
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
        </FormControl>

        {/* Semester Input */}
        <TextField
          fullWidth
          label="Semester"
          name="semester"
          type="number"
          value={formData.semester}
          onChange={handleChange}
          required
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
          required
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
          required
          margin="normal"
        />

        {/* Programme Dropdown */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="programme-label">Programme</InputLabel>
          <Select
            labelId="programme-label"
            label="Programme"
            id="programme"
            name="programme"
            value={formData.programme}
            onChange={handleChange}
            required
          >
            <MenuItem value="">
              <em>Select Programme</em>
            </MenuItem>
            {programmes.map((prog) => (
              <MenuItem key={prog.programme_id} value={prog.programme_name}>
                {prog.programme_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Syllabus Year Input */}
        <TextField
          fullWidth
          label="Syllabus Year"
          name="syllabus_year"
          type="number"
          value={formData.syllabus_year}
          onChange={handleChange}
          required
          margin="normal"
        />

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/manage-courses")}
          >
            Back
          </Button>
          <Button variant="contained" type="submit">
            Update Course
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditCourse;
